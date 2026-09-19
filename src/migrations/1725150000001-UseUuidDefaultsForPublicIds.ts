import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseUuidDefaultsForPublicIds1725150000001 implements MigrationInterface {
  name = 'UseUuidDefaultsForPublicIds1725150000001';

  private readonly tables = [
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

  private async getPublicIdColumn(
    queryRunner: QueryRunner,
    table: string,
  ): Promise<'uuid' | '_id' | null> {
    if (await queryRunner.hasColumn(table, 'uuid')) return 'uuid';
    if (await queryRunner.hasColumn(table, '_id')) return '_id';
    return null;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of this.tables) {
      const column = await this.getPublicIdColumn(queryRunner, table);
      if (!column) continue;

      await queryRunner.query(
        `ALTER TABLE \`${table}\` MODIFY \`${column}\` varchar(36) NOT NULL DEFAULT (UUID())`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of [...this.tables].reverse()) {
      const column = await this.getPublicIdColumn(queryRunner, table);
      if (!column) continue;

      await queryRunner.query(
        `ALTER TABLE \`${table}\` MODIFY \`${column}\` varchar(36) NOT NULL`,
      );
    }
  }
}
