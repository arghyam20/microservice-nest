import { MigrationInterface, QueryRunner } from 'typeorm';

type ForeignKeyDefinition = {
  table: string;
  name: string;
  column: string;
  referencedTable: string;
  onDelete: string;
};

export class RenamePublicIdToUuid1725150000002 implements MigrationInterface {
  name = 'RenamePublicIdToUuid1725150000002';

  private readonly publicIdTables = [
    'roles',
    'users',
    'accesses',
    'categories',
    'cms',
    'contact_us',
    'admin_replies',
    'media',
    'settings',
    'refreshTokens',
    'user_devices',
    'notifications',
  ];

  private readonly foreignKeys: ForeignKeyDefinition[] = [
    {
      table: 'accesses',
      name: 'FK_accesses_parent',
      column: 'parentId',
      referencedTable: 'accesses',
      onDelete: 'SET NULL',
    },
    {
      table: 'categories',
      name: 'FK_categories_user',
      column: 'userId',
      referencedTable: 'users',
      onDelete: 'SET NULL',
    },
    {
      table: 'categories',
      name: 'FK_categories_parent',
      column: 'parentId',
      referencedTable: 'categories',
      onDelete: 'SET NULL',
    },
    {
      table: 'admin_replies',
      name: 'FK_admin_replies_contact',
      column: 'contactId',
      referencedTable: 'contact_us',
      onDelete: 'CASCADE',
    },
    {
      table: 'refreshTokens',
      name: 'FK_refresh_tokens_user',
      column: 'userId',
      referencedTable: 'users',
      onDelete: 'CASCADE',
    },
    {
      table: 'user_devices',
      name: 'FK_user_devices_user',
      column: 'user_id',
      referencedTable: 'users',
      onDelete: 'CASCADE',
    },
    {
      table: 'notifications',
      name: 'FK_notifications_user',
      column: 'userId',
      referencedTable: 'users',
      onDelete: 'SET NULL',
    },
    {
      table: 'notifications',
      name: 'FK_notifications_receiver',
      column: 'receiverUserId',
      referencedTable: 'users',
      onDelete: 'SET NULL',
    },
    {
      table: 'notifications',
      name: 'FK_notifications_category',
      column: 'categoryId',
      referencedTable: 'categories',
      onDelete: 'SET NULL',
    },
    {
      table: 'notifications',
      name: 'FK_notifications_sub_category',
      column: 'subCategoryId',
      referencedTable: 'categories',
      onDelete: 'SET NULL',
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.dropForeignKeys(queryRunner);

    for (const table of this.publicIdTables) {
      await this.renameColumnIfExists(queryRunner, table, '_id', 'uuid');
    }

    await this.addForeignKeys(queryRunner, 'uuid');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.dropForeignKeys(queryRunner);

    for (const table of this.publicIdTables) {
      await this.renameColumnIfExists(queryRunner, table, 'uuid', '_id');
    }

    await this.addForeignKeys(queryRunner, '_id');
  }

  private async renameColumnIfExists(
    queryRunner: QueryRunner,
    table: string,
    from: string,
    to: string,
  ): Promise<void> {
    if (!(await queryRunner.hasColumn(table, from))) return;
    if (await queryRunner.hasColumn(table, to)) return;

    await queryRunner.query(
      `ALTER TABLE \`${table}\` CHANGE \`${from}\` \`${to}\` varchar(36) NOT NULL DEFAULT (UUID())`,
    );
  }

  private async dropForeignKeys(queryRunner: QueryRunner): Promise<void> {
    for (const foreignKey of this.foreignKeys) {
      const exists = await this.foreignKeyExists(queryRunner, foreignKey);
      if (!exists) continue;

      await queryRunner.query(
        `ALTER TABLE \`${foreignKey.table}\` DROP FOREIGN KEY \`${foreignKey.name}\``,
      );
    }
  }

  private async addForeignKeys(
    queryRunner: QueryRunner,
    referencedColumn: 'uuid' | '_id',
  ): Promise<void> {
    for (const foreignKey of this.foreignKeys) {
      if (await this.foreignKeyExists(queryRunner, foreignKey)) continue;

      await queryRunner.query(`
        ALTER TABLE \`${foreignKey.table}\`
        ADD CONSTRAINT \`${foreignKey.name}\`
        FOREIGN KEY (\`${foreignKey.column}\`)
        REFERENCES \`${foreignKey.referencedTable}\`(\`${referencedColumn}\`)
        ON DELETE ${foreignKey.onDelete}
      `);
    }
  }

  private async foreignKeyExists(
    queryRunner: QueryRunner,
    foreignKey: ForeignKeyDefinition,
  ): Promise<boolean> {
    const rows = await queryRunner.query(
      `
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE CONSTRAINT_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND CONSTRAINT_NAME = ?
          AND CONSTRAINT_TYPE = 'FOREIGN KEY'
      `,
      [foreignKey.table, foreignKey.name],
    );

    return rows.length > 0;
  }
}
