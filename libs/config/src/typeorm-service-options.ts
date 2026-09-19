import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function createTypeOrmOptions(
  configService: ConfigService,
  databaseName: string,
): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: Number(configService.get<string>('DB_PORT', '3306')),
    username: configService.get<string>('DB_USERNAME', 'root'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.get<string>('DB_DATABASE', databaseName),
    autoLoadEntities: true,
    synchronize:
      configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
  };
}
