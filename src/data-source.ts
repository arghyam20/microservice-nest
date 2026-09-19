import 'reflect-metadata';
import 'tsconfig-paths/register';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Access } from './modules/access/schemas/access.schema';
import { AdminReply } from './modules/admin-reply/schemas/admin-reply.schema';
import { Category } from './modules/category/schemas/category.schema';
import { Cms } from './modules/cms/schemas/cms.schema';
import { ContactUs } from './modules/contact-us/schemas/contact-us.schema';
import { Media } from './modules/media/schemas/media.schema';
import { Notification } from './modules/notification/schemas/notification.schema';
import { RefreshToken } from './modules/refresh-token/schemas/refresh-token.schema';
import { Role } from './modules/role/schemas/role.schema';
import { Setting } from './modules/setting/schemas/setting.schema';
import { UserDevice } from './modules/user-devices/schemas/user-device.schema';
import { User } from './modules/user/schemas/user.schema';

config({ path: '.env' });

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'nestjs_api',
  entities: [
    Access,
    AdminReply,
    Category,
    Cms,
    ContactUs,
    Media,
    Notification,
    RefreshToken,
    Role,
    Setting,
    UserDevice,
    User,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
