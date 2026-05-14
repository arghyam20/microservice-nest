import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'data/order.db',
      entities: [Order, OrderItem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order, OrderItem]),
    ClientsModule.register([{
      name: 'KAFKA_CLIENT',
      transport: Transport.KAFKA,
      options: {
        client: { clientId: 'order-service-producer', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
        consumer: { groupId: 'order-service-producer-group' },
      },
    }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
