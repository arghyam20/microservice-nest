import { Module } from '@nestjs/common';
import { SettingApiController } from './setting.api.controller';
import { SettingServiceApi } from './setting.api.service';

@Module({
  imports: [],
  controllers: [SettingApiController],
  providers: [SettingServiceApi],
  exports: [SettingServiceApi],
})
export class SettingModule {}
