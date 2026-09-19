import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController, SERVICE_NAME } from '../../../libs/common/src';
import { PrismaModule } from '../../../libs/prisma/src';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    PaymentModule,
  ],
  controllers: [HealthController],
  providers: [Logger, { provide: SERVICE_NAME, useValue: 'payment-service' }],
})
export class AppModule {}
