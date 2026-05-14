import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from '../../kafka/kafka.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { MenuItem } from './entities/menu-item.entity';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem]), RestaurantModule, KafkaModule],
  controllers: [MenuItemController],
  providers: [MenuItemService],
  exports: [MenuItemService],
})
export class MenuItemModule {}
