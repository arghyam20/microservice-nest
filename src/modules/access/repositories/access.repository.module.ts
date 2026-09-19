import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from '../schemas/access.schema';
import { AccessRepository } from './access.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Access])],
  providers: [AccessRepository],
  exports: [AccessRepository],
})
export class AccessRepositoryModule {}
