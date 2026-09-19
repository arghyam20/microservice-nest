import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from '../../../../src/modules/access/schemas/access.schema';
import { RefreshToken } from '../../../../src/modules/refresh-token/schemas/refresh-token.schema';
import { Role } from '../../../../src/modules/role/schemas/role.schema';
import { UserDevice } from '../../../../src/modules/user-devices/schemas/user-device.schema';
import { User } from '../../../../src/modules/user/schemas/user.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Access, RefreshToken, Role, UserDevice, User]),
  ],
})
export class UserServiceModule {}
