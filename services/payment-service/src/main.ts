import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(PaymentModule, {
    transport: Transport.KAFKA,
    options: {
      client: { clientId: 'payment-service', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
      consumer: { groupId: 'payment-service-group' },
    },
  });
  await app.listen();
  console.log('Payment Service is listening');
}
bootstrap();
