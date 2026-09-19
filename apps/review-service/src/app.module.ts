import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController, SERVICE_NAME } from '../../../libs/common/src';
import { PrismaModule } from '../../../libs/prisma/src';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    ReviewModule,
  ],
  controllers: [HealthController],
  providers: [Logger, { provide: SERVICE_NAME, useValue: 'review-service' }],
})
export class AppModule {}
