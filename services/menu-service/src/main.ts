import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MenuModule } from './menu.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MenuModule, {
    transport: Transport.KAFKA,
    options: {
      client: { clientId: 'menu-service', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
      consumer: { groupId: 'menu-service-group' },
    },
  });
  await app.listen();
  console.log('Menu Service is listening');
}
bootstrap();
