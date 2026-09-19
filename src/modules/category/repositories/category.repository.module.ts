import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../schemas/category.schema';
import { CategoryRepository } from './category.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryRepositoryModule {}
