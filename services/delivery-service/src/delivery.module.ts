import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { Delivery } from './entities/delivery.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'data/delivery.db',
      entities: [Delivery],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Delivery]),
    ClientsModule.register([{
      name: 'KAFKA_CLIENT',
      transport: Transport.KAFKA,
      options: {
        client: { clientId: 'delivery-service-producer', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
        consumer: { groupId: 'delivery-service-producer-group' },
      },
    }]),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
