import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

async function testKafka() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const kafkaClient = app.get<ClientProxy>('KAFKA_CLIENT');

  // Test sending a message
  try {
    const result = await kafkaClient.send('user.get', { userId: 'test-id' }).toPromise();
    console.log('Kafka message sent successfully:', result);
  } catch (error) {
    console.log('Kafka test (expected to fail without running user service):', error.message);
  }

  await app.close();
}

testKafka();
