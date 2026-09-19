import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../../../../src/modules/category/schemas/category.schema';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
})
export class ProductModule {}
