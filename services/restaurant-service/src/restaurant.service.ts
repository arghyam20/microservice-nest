import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Restaurant } from './entities/restaurant.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  // --- Restaurant ---
  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    const saved = await this.restaurantRepo.save(this.restaurantRepo.create(data));
    this.kafka.emit('restaurant.created', { restaurantId: saved.id, name: saved.name });
    return saved;
  }

  async findAllRestaurants(page = 1, limit = 10) {
    const [data, totalItems] = await this.restaurantRepo.findAndCount({
      skip: (page - 1) * limit, take: limit, order: { name: 'ASC' },
    });
    return { data, meta: { totalItems, currentPage: page, itemsPerPage: limit, totalPages: Math.ceil(totalItems / limit) } };
  }

  async findOneRestaurant(id: string): Promise<Restaurant> {
    const r = await this.restaurantRepo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Restaurant not found');
    return r;
  }

  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    const r = await this.findOneRestaurant(id);
    Object.assign(r, data);
    const saved = await this.restaurantRepo.save(r);
    this.kafka.emit('restaurant.updated', { restaurantId: saved.id, status: saved.status });
    return saved;
  }

  // --- Category ---
  async createCategory(data: Partial<Category>): Promise<Category> {
    const saved = await this.categoryRepo.save(this.categoryRepo.create(data));
    this.kafka.emit('category.created', { categoryId: saved.id, name: saved.name });
    return saved;
  }

  async findAllCategories(page = 1, limit = 10) {
    const [data, totalItems] = await this.categoryRepo.findAndCount({
      skip: (page - 1) * limit, take: limit, order: { name: 'ASC' },
    });
    return { data, meta: { totalItems, currentPage: page, itemsPerPage: limit, totalPages: Math.ceil(totalItems / limit) } };
  }

  async findOneCategory(id: string): Promise<Category> {
    const c = await this.categoryRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Category not found');
    return c;
  }
}
