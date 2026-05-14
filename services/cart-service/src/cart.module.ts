import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'data/cart.db',
      entities: [CartItem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([CartItem]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
