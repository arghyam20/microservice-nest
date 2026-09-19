import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../schemas/role.schema';
import { RoleRepository } from './role.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleRepository],
  exports: [RoleRepository],
})
export class RoleRepositoryModule {}
