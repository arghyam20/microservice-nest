import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMysqlSchema1725150000000 implements MigrationInterface {
  name = 'InitialMysqlSchema1725150000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE roles (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        role varchar(255) NOT NULL,
        roleDisplayName varchar(255) NOT NULL,
        roleGroup enum('admin','user') NOT NULL DEFAULT 'admin',
        description text NULL,
        permissions json NULL,
        status enum('Active','Inactive') NOT NULL DEFAULT 'Active',
        isDeleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_roles_uuid (uuid),
        INDEX IDX_roles_role_deleted (role, isDeleted),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE users (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        roles json NULL,
        firstName varchar(255) NOT NULL DEFAULT '',
        lastName varchar(255) NOT NULL DEFAULT '',
        fullName varchar(255) NOT NULL DEFAULT '',
        countryCode varchar(20) NOT NULL DEFAULT '',
        phone varchar(50) NOT NULL DEFAULT '',
        email varchar(255) NOT NULL DEFAULT '',
        userName varchar(255) NOT NULL DEFAULT '',
        password varchar(255) NOT NULL DEFAULT '',
        profileImage varchar(255) NOT NULL DEFAULT '',
        emailOtp varchar(20) NOT NULL DEFAULT '',
        otpExpireTime datetime NULL DEFAULT NULL,
        bio text NULL,
        status enum('Active','Inactive') NOT NULL DEFAULT 'Active',
        isAccountVerified tinyint NOT NULL DEFAULT 0,
        isProfileCompleted tinyint NOT NULL DEFAULT 0,
        isPushNotification tinyint NOT NULL DEFAULT 1,
        isDeleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_users_uuid (uuid),
        INDEX IDX_users_firstName (firstName),
        INDEX IDX_users_lastName (lastName),
        INDEX IDX_users_fullName (fullName),
        INDEX IDX_users_phone (phone),
        INDEX IDX_users_email (email),
        INDEX IDX_users_userName (userName),
        INDEX IDX_users_status (status),
        INDEX IDX_users_deleted (isDeleted),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE accesses (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        name varchar(255) NOT NULL DEFAULT '',
        parentId varchar(36) NULL DEFAULT NULL,
        slug varchar(255) NOT NULL DEFAULT '',
        description text NULL,
        status enum('Active','Inactive') NOT NULL DEFAULT 'Active',
        impact tinyint NOT NULL DEFAULT 0,
        required tinyint NOT NULL DEFAULT 0,
        isDeleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_accesses_uuid (uuid),
        INDEX IDX_accesses_slug_deleted (slug, isDeleted),
        INDEX IDX_accesses_parent (parentId),
        PRIMARY KEY (id),
        CONSTRAINT FK_accesses_parent FOREIGN KEY (parentId) REFERENCES accesses(uuid) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE categories (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        userId varchar(36) NULL DEFAULT NULL,
        name varchar(255) NOT NULL DEFAULT '',
        slug varchar(255) NOT NULL DEFAULT '',
        description text NULL,
        icon varchar(255) NOT NULL DEFAULT '',
        parentId varchar(36) NULL DEFAULT NULL,
        status enum('Active','Inactive') NOT NULL DEFAULT 'Active',
        isDeleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_categories_uuid (uuid),
        INDEX IDX_categories_user (userId),
        INDEX IDX_categories_parent (parentId),
        PRIMARY KEY (id),
        CONSTRAINT FK_categories_user FOREIGN KEY (userId) REFERENCES users(uuid) ON DELETE SET NULL,
        CONSTRAINT FK_categories_parent FOREIGN KEY (parentId) REFERENCES categories(uuid) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE cms (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        title varchar(255) NOT NULL DEFAULT '',
        slug varchar(255) NOT NULL DEFAULT '',
        content longtext NULL,
        status enum('Active','Inactive') NOT NULL DEFAULT 'Active',
        isDeleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_cms_uuid (uuid),
        INDEX IDX_cms_title (title),
        INDEX IDX_cms_slug (slug),
        INDEX IDX_cms_status (status),
        INDEX IDX_cms_deleted (isDeleted),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE contact_us (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        firstName varchar(255) NOT NULL DEFAULT '',
        lastName varchar(255) NOT NULL DEFAULT '',
        fullName varchar(255) NOT NULL DEFAULT '',
        email varchar(255) NOT NULL DEFAULT '',
        subject varchar(255) NOT NULL DEFAULT '',
        message text NULL,
        isReplied tinyint NOT NULL DEFAULT 0,
        status enum('Active','Inactive') NOT NULL DEFAULT 'Active',
        isDeleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_contact_us_uuid (uuid),
        INDEX IDX_contact_us_firstName (firstName),
        INDEX IDX_contact_us_lastName (lastName),
        INDEX IDX_contact_us_fullName (fullName),
        INDEX IDX_contact_us_email (email),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE admin_replies (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        contactId varchar(36) NULL,
        message text NULL,
        status enum('Active','Inactive') NOT NULL DEFAULT 'Active',
        isDeleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_admin_replies_uuid (uuid),
        INDEX IDX_admin_replies_contact (contactId),
        PRIMARY KEY (id),
        CONSTRAINT FK_admin_replies_contact FOREIGN KEY (contactId) REFERENCES contact_us(uuid) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE media (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        originalName varchar(255) NOT NULL,
        fileName varchar(255) NOT NULL,
        folder varchar(255) NOT NULL DEFAULT '',
        mimeType varchar(100) NOT NULL,
        encoding varchar(100) NOT NULL DEFAULT '',
        size int NOT NULL,
        \`key\` varchar(255) NOT NULL,
        status enum('Active','Inactive') NOT NULL DEFAULT 'Active',
        isAttached tinyint NOT NULL DEFAULT 0,
        isDeleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_media_uuid (uuid),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE settings (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        email varchar(255) NOT NULL DEFAULT '',
        phone varchar(50) NOT NULL DEFAULT '',
        address text NULL,
        status enum('Active','Inactive') NOT NULL DEFAULT 'Active',
        isDeleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_settings_uuid (uuid),
        INDEX IDX_settings_phone (phone),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE refreshTokens (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        hash varchar(255) NOT NULL,
        userId varchar(36) NOT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_refresh_tokens_uuid (uuid),
        INDEX IDX_refresh_tokens_hash (hash),
        INDEX IDX_refresh_tokens_user (userId),
        INDEX IDX_refresh_tokens_created (createdAt),
        PRIMARY KEY (id),
        CONSTRAINT FK_refresh_tokens_user FOREIGN KEY (userId) REFERENCES users(uuid) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE user_devices (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        user_id varchar(36) NULL,
        webPush json NULL,
        deviceToken varchar(255) NOT NULL DEFAULT '',
        deviceType enum('Web','Android','iOS') NOT NULL DEFAULT 'Web',
        ip varchar(100) NOT NULL DEFAULT '',
        ip_lat varchar(50) NOT NULL DEFAULT '',
        ip_long varchar(50) NOT NULL DEFAULT '',
        browserInfo json NULL,
        deviceInfo json NULL,
        operatingSystem json NULL,
        last_active datetime NULL DEFAULT NULL,
        state varchar(255) NOT NULL DEFAULT '',
        country varchar(255) NOT NULL DEFAULT '',
        city varchar(255) NOT NULL DEFAULT '',
        timezone varchar(255) NOT NULL DEFAULT '',
        accessToken varchar(1024) NULL DEFAULT NULL,
        expired tinyint NOT NULL DEFAULT 0,
        role enum('admin','user') NULL,
        isLoggedOut tinyint NOT NULL DEFAULT 0,
        isDeleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_user_devices_uuid (uuid),
        UNIQUE INDEX IDX_user_devices_access_token (accessToken),
        INDEX IDX_user_devices_user (user_id),
        INDEX IDX_user_devices_device_token (deviceToken),
        INDEX IDX_user_devices_device_type (deviceType),
        INDEX IDX_user_devices_ip (ip),
        INDEX IDX_user_devices_last_active (last_active),
        INDEX IDX_user_devices_expired (expired),
        INDEX IDX_user_devices_role (role),
        INDEX IDX_user_devices_logged_out (isLoggedOut),
        INDEX IDX_user_devices_deleted (isDeleted),
        PRIMARY KEY (id),
        CONSTRAINT FK_user_devices_user FOREIGN KEY (user_id) REFERENCES users(uuid) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE notifications (
        id int NOT NULL AUTO_INCREMENT,
        uuid varchar(36) NOT NULL DEFAULT (UUID()),
        userId varchar(36) NULL DEFAULT NULL,
        receiverUserId varchar(36) NULL DEFAULT NULL,
        title varchar(255) NOT NULL DEFAULT '',
        message text NULL,
        workflowId varchar(36) NULL DEFAULT NULL,
        formId varchar(36) NULL DEFAULT NULL,
        categoryId varchar(36) NULL DEFAULT NULL,
        subCategoryId varchar(36) NULL DEFAULT NULL,
        stepNo int NULL DEFAULT NULL,
        stepId varchar(255) NULL DEFAULT NULL,
        sectionNo int NULL DEFAULT NULL,
        sectionId varchar(255) NULL DEFAULT NULL,
        type enum('section-submitted','section-approved','section-rejected','step-completed','step-activated','approval-requested','approval-approved','approval-rejected','modification-requested','modification-submitted','workflow-completed','role-ownership-changed') NOT NULL DEFAULT 'section-submitted',
        data json NULL,
        isRead tinyint NOT NULL DEFAULT 0,
        readAt datetime NULL DEFAULT NULL,
        status enum('Active','Inactive') NOT NULL DEFAULT 'Active',
        isDeleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_notifications_uuid (uuid),
        INDEX IDX_notifications_user (userId),
        INDEX IDX_notifications_receiver (receiverUserId),
        INDEX IDX_notifications_workflow (workflowId),
        INDEX IDX_notifications_form (formId),
        INDEX IDX_notifications_category (categoryId),
        INDEX IDX_notifications_sub_category (subCategoryId),
        PRIMARY KEY (id),
        CONSTRAINT FK_notifications_user FOREIGN KEY (userId) REFERENCES users(uuid) ON DELETE SET NULL,
        CONSTRAINT FK_notifications_receiver FOREIGN KEY (receiverUserId) REFERENCES users(uuid) ON DELETE SET NULL,
        CONSTRAINT FK_notifications_category FOREIGN KEY (categoryId) REFERENCES categories(uuid) ON DELETE SET NULL,
        CONSTRAINT FK_notifications_sub_category FOREIGN KEY (subCategoryId) REFERENCES categories(uuid) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS notifications');
    await queryRunner.query('DROP TABLE IF EXISTS user_devices');
    await queryRunner.query('DROP TABLE IF EXISTS refreshTokens');
    await queryRunner.query('DROP TABLE IF EXISTS settings');
    await queryRunner.query('DROP TABLE IF EXISTS media');
    await queryRunner.query('DROP TABLE IF EXISTS admin_replies');
    await queryRunner.query('DROP TABLE IF EXISTS contact_us');
    await queryRunner.query('DROP TABLE IF EXISTS cms');
    await queryRunner.query('DROP TABLE IF EXISTS categories');
    await queryRunner.query('DROP TABLE IF EXISTS accesses');
    await queryRunner.query('DROP TABLE IF EXISTS users');
    await queryRunner.query('DROP TABLE IF EXISTS roles');
  }
}
