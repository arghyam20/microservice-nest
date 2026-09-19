import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController, SERVICE_NAME } from '../../../libs/common/src';
import { createTypeOrmOptions } from '../../../libs/config/src';
import { VendorModule } from './modules/vendor/vendor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(configService, 'user_db'),
    }),
    VendorModule,
  ],
  controllers: [HealthController],
  providers: [Logger, { provide: SERVICE_NAME, useValue: 'vendor-service' }],
})
export class AppModule {}
