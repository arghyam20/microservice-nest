import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController, SERVICE_NAME } from '../../../libs/common/src';
import { PrismaModule } from '../../../libs/prisma/src';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    InventoryModule,
  ],
  controllers: [HealthController],
  providers: [Logger, { provide: SERVICE_NAME, useValue: 'inventory-service' }],
})
export class AppModule {}
