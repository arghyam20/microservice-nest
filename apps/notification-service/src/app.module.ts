import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController, SERVICE_NAME } from '../../../libs/common/src';
import { PrismaModule } from '../../../libs/prisma/src';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    NotificationModule,
  ],
  controllers: [HealthController],
  providers: [
    Logger,
    { provide: SERVICE_NAME, useValue: 'notification-service' },
  ],
})
export class AppModule {}
