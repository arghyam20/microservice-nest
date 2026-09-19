import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDevice } from '../schemas/user-device.schema';
import { UserDeviceRepository } from './user-device.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserDevice])],
  providers: [UserDeviceRepository],
  exports: [UserDeviceRepository],
})
export class UserDeviceRepositoryModule {}
