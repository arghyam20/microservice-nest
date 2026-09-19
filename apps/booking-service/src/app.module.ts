import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController, SERVICE_NAME } from '../../../libs/common/src';
import { PrismaModule } from '../../../libs/prisma/src';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    BookingModule,
  ],
  controllers: [HealthController],
  providers: [Logger, { provide: SERVICE_NAME, useValue: 'booking-service' }],
})
export class AppModule {}
