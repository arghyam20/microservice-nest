import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'data/user.db',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([{
      name: 'KAFKA_CLIENT',
      transport: Transport.KAFKA,
      options: {
        client: { clientId: 'user-service-producer', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
        consumer: { groupId: 'user-service-producer-group' },
      },
    }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
