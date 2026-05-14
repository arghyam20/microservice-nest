import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrderModule, {
    transport: Transport.KAFKA,
    options: {
      client: { clientId: 'order-service', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
      consumer: { groupId: 'order-service-group' },
    },
  });
  await app.listen();
  console.log('Order Service is listening');
}
bootstrap();
