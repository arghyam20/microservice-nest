import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResult } from '../../common/interfaces/pagination.interface';
import { KafkaService } from '../../kafka/kafka.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.save(this.restaurantRepository.create(createRestaurantDto));
    await this.kafkaService.emit('restaurant.created', { restaurantId: restaurant.id, name: restaurant.name });
    return restaurant;
  }

  async findAll(pagination: PaginationDto): Promise<PaginationResult<Restaurant>> {
    const [data, totalItems] = await this.restaurantRepository.findAndCount({
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

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOneBy({ id });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    Object.assign(restaurant, updateRestaurantDto);
    const saved = await this.restaurantRepository.save(restaurant);
    await this.kafkaService.emit('restaurant.updated', { restaurantId: saved.id, status: saved.status });
    return saved;
  }
}
