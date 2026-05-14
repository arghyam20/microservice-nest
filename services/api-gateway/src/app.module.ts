import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { MenuModule } from './modules/menu/menu.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DeliveryModule } from './modules/delivery/delivery.module';

const kafkaBroker = process.env.KAFKA_BROKER || 'localhost:9092';

const KAFKA_SERVICES = [
  { name: 'AUTH_SERVICE', clientId: 'gateway-auth' },
  { name: 'USER_SERVICE', clientId: 'gateway-user' },
  { name: 'RESTAURANT_SERVICE', clientId: 'gateway-restaurant' },
  { name: 'MENU_SERVICE', clientId: 'gateway-menu' },
  { name: 'CART_SERVICE', clientId: 'gateway-cart' },
  { name: 'ORDER_SERVICE', clientId: 'gateway-order' },
  { name: 'PAYMENT_SERVICE', clientId: 'gateway-payment' },
  { name: 'DELIVERY_SERVICE', clientId: 'gateway-delivery' },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register(
      KAFKA_SERVICES.map(({ name, clientId }) => ({
        name,
        transport: Transport.KAFKA,
        options: {
          client: { clientId, brokers: [kafkaBroker] },
          consumer: { groupId: `${clientId}-group` },
        },
      })),
    ),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    MenuModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    DeliveryModule,
  ],
})
export class AppModule {}
