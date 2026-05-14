import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuItem } from './entities/menu-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'data/menu.db',
      entities: [MenuItem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([MenuItem]),
    ClientsModule.register([{
      name: 'KAFKA_CLIENT',
      transport: Transport.KAFKA,
      options: {
        client: { clientId: 'menu-service-producer', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
        consumer: { groupId: 'menu-service-producer-group' },
      },
    }]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
