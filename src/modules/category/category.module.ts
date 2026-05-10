import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { KafkaModule } from '../../kafka/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), KafkaModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
