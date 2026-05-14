import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem) private readonly menuItemRepo: Repository<MenuItem>,
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  async create(data: Partial<MenuItem>): Promise<MenuItem> {
    const saved = await this.menuItemRepo.save(this.menuItemRepo.create(data));
    this.kafka.emit('menu-item.created', { menuItemId: saved.id, restaurantId: saved.restaurantId });
    return saved;
  }

  async findAll(page = 1, limit = 10, restaurantId?: string) {
    const [data, totalItems] = await this.menuItemRepo.findAndCount({
      where: restaurantId ? { restaurantId } : {},
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });
    return { data, meta: { totalItems, currentPage: page, itemsPerPage: limit, totalPages: Math.ceil(totalItems / limit) } };
  }

  async findOne(id: string): Promise<MenuItem> {
    const item = await this.menuItemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async update(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    const item = await this.findOne(id);
    Object.assign(item, data);
    const saved = await this.menuItemRepo.save(item);
    this.kafka.emit('menu-item.updated', { menuItemId: saved.id, status: saved.status });
    return saved;
  }
}
