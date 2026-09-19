import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigModule } from '../../config.module';
import { User } from '../user/schemas/user.schema';
import { Role } from '../role/schemas/role.schema';
import { SeederService } from './seeder.service';

@Module({
  imports: [ApiConfigModule, TypeOrmModule.forFeature([User, Role])],
  providers: [SeederService],
})
export class SeederModule {}
