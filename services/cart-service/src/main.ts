import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { CartModule } from './cart.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(CartModule, {
    transport: Transport.KAFKA,
    options: {
      client: { clientId: 'cart-service', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
      consumer: { groupId: 'cart-service-group' },
    },
  });
  await app.listen();
  console.log('Cart Service is listening');
}
bootstrap();
