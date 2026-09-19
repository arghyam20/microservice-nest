import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting, SettingDocument } from '../schemas/setting.schema';
import { BaseRepository } from 'src/common/bases/base.repository';

@Injectable()
export class SettingRepository extends BaseRepository<SettingDocument> {
  constructor(
    @InjectRepository(Setting) private model: Repository<SettingDocument>,
  ) {
    super(model);
  }

  async findSettingCms(): Promise<SettingDocument | null> {
    return await this.model.findOne({ where: {} });
  }
}
