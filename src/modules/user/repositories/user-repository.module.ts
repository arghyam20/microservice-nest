import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../schemas/user.schema';
import { UserRepository } from './user.repository';
import { Role } from 'src/modules/role/schemas/role.schema';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserRepositoryModule {}
