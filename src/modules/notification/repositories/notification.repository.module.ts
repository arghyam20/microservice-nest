import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../schemas/notification.schema';
import { NotificationRepository } from './notification.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationRepository],
  exports: [NotificationRepository],
})
export class NotificationRepositoryModule {}
