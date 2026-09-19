import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController, SERVICE_NAME } from '../../../libs/common/src';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
  controllers: [HealthController],
  providers: [Logger, { provide: SERVICE_NAME, useValue: 'api-gateway' }],
})
export class AppModule {}
