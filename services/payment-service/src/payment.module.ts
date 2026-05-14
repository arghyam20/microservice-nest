import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'data/payment.db',
      entities: [Payment],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Payment]),
    ClientsModule.register([{
      name: 'KAFKA_CLIENT',
      transport: Transport.KAFKA,
      options: {
        client: { clientId: 'payment-service-producer', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
        consumer: { groupId: 'payment-service-producer-group' },
      },
    }]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
