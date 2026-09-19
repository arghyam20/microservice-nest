import { NestFactory } from '@nestjs/core';
import { SeederModule } from './modules/seeder/seeder.module';
import { SeederService } from './modules/seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const seederService = app.get(SeederService);
  let exitCode = 0;

  try {
    await seederService.seed();
  } catch (error) {
    console.error('Seeding failed:', error);
    exitCode = 1;
  } finally {
    await app.close();
    process.exit(exitCode);
  }
}

bootstrap();
