import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cms } from '../schemas/cms.schema';
import { CmsRepository } from './cms.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Cms])],
  providers: [CmsRepository],
  exports: [CmsRepository],
})
export class CmsRepositoryModule {}
