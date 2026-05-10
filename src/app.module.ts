import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { CategoryModule } from './modules/category/category.module';
import { KafkaModule } from './kafka/kafka.module';
import configuration from './configuration';
import { User } from './modules/user/entities/user.entity';
import { Role } from './modules/role/entities/role.entity';
import { Category } from './modules/category/entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'data/sqlite.db',
      entities: [User, Role, Category],
      synchronize: true,
      logging: false,
    }),
    KafkaModule,
    AuthModule,
    UserModule,
    RoleModule,
    CategoryModule,
  ],
})
export class AppModule {}
