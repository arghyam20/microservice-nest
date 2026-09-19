import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

export function configureHttpApp(
  app: INestApplication,
  serviceName: string,
): void {
  process.env.SERVICE_NAME = serviceName;
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`${serviceName} API`)
    .setDescription(`${serviceName} service documentation`)
    .setVersion('1.0')
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, config),
  );
}

export async function listenHttpApp(
  app: INestApplication,
  defaultPort: number,
): Promise<void> {
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);
  const serviceName = configService.get<string>('SERVICE_NAME', '');
  const servicePortKey = serviceName
    ? `${serviceName.toUpperCase().replace(/-/g, '_')}_PORT`
    : '';
  const configuredPort = servicePortKey
    ? configService.get<string>(servicePortKey)
    : undefined;
  const port = Number(configuredPort ?? configService.get('PORT', defaultPort));
  await app.listen(port);
  logger.log(`Listening on http://127.0.0.1:${port}/api/docs`);
}
