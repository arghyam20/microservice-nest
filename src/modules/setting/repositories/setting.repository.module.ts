import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from '../schemas/setting.schema';
import { SettingRepository } from './setting.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  providers: [SettingRepository],
  exports: [SettingRepository],
})
export class SettingRepositoryModule {}
