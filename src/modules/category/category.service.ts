import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResult } from '../../common/interfaces/pagination.interface';
import { KafkaService } from '../../kafka/kafka.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, imageUrl?: string): Promise<Category> {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      imageUrl,
    });
    const savedCategory = await this.categoryRepository.save(category);

    // Emit event to Kafka
    await this.kafkaService.emit('category.created', {
      categoryId: savedCategory.id,
      name: savedCategory.name,
      status: savedCategory.status,
    });

    return savedCategory;
  }

  async findAll(pagination: PaginationDto): Promise<PaginationResult<Category>> {
    const [data, totalItems] = await this.categoryRepository.findAndCount({
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      order: { name: 'ASC' },
    });

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: pagination.limit,
        totalPages: Math.ceil(totalItems / pagination.limit),
        currentPage: pagination.page,
      },
    };
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ id });
  }

}
