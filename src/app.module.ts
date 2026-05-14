import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { CategoryModule } from './modules/category/category.module';
import { KafkaModule } from './kafka/kafka.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { MenuItemModule } from './modules/menu-item/menu-item.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import configuration from './configuration';
import { User } from './modules/user/entities/user.entity';
import { Role } from './modules/role/entities/role.entity';
import { Category } from './modules/category/entities/category.entity';
import { Restaurant } from './modules/restaurant/entities/restaurant.entity';
import { MenuItem } from './modules/menu-item/entities/menu-item.entity';
import { CartItem } from './modules/cart/entities/cart-item.entity';
import { Order } from './modules/order/entities/order.entity';
import { OrderItem } from './modules/order/entities/order-item.entity';
import { Payment } from './modules/payment/entities/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'data/sqlite.db',
      entities: [User, Role, Category, Restaurant, MenuItem, CartItem, Order, OrderItem, Payment],
      synchronize: true,
      logging: false,
    }),
    KafkaModule,
    AuthModule,
    UserModule,
    RoleModule,
    CategoryModule,
    RestaurantModule,
    MenuItemModule,
    CartModule,
    OrderModule,
    PaymentModule,
  ],
})
export class AppModule {}
