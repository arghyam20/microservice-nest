import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/bases/base.repository';
import { Media, MediaDocument } from '../schemas/media.schema';

@Injectable()
export class MediaRepository extends BaseRepository<MediaDocument> {
  constructor(@InjectRepository(Media) repository: Repository<MediaDocument>) {
    super(repository);
  }
}
