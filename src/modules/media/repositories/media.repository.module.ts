import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../schemas/media.schema';
import { MediaRepository } from './media.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  providers: [MediaRepository],
  exports: [MediaRepository],
})
export class MediaRepositoryModule {}
