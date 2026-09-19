import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './schemas/role.schema';
import { RoleAdminService } from './role.admin.service';
import { RoleAdminController } from './role.admin.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleAdminController],
  providers: [RoleAdminService],
  exports: [RoleAdminService],
})
export class RoleModule {}
