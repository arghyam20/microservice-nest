import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { RestaurantModule } from './restaurant.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RestaurantModule, {
    transport: Transport.KAFKA,
    options: {
      client: { clientId: 'restaurant-service', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
      consumer: { groupId: 'restaurant-service-group' },
    },
  });
  await app.listen();
  console.log('Restaurant Service is listening');
}
bootstrap();
