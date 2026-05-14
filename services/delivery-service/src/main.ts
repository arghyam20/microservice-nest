import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DeliveryModule } from './delivery.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(DeliveryModule, {
    transport: Transport.KAFKA,
    options: {
      client: { clientId: 'delivery-service', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
      consumer: { groupId: 'delivery-service-group' },
    },
  });
  await app.listen();
  console.log('Delivery Service is listening');
}
bootstrap();
