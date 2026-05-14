import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResult } from '../../common/interfaces/pagination.interface';
import { KafkaService } from '../../kafka/kafka.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    private readonly restaurantService: RestaurantService,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    await this.restaurantService.findOne(createMenuItemDto.restaurantId);
    const item = await this.menuItemRepository.save(this.menuItemRepository.create(createMenuItemDto));
    await this.kafkaService.emit('menu-item.created', { menuItemId: item.id, restaurantId: item.restaurantId });
    return item;
  }

  async findAll(pagination: PaginationDto, restaurantId?: string): Promise<PaginationResult<MenuItem>> {
    const [data, totalItems] = await this.menuItemRepository.findAndCount({
      where: restaurantId ? { restaurantId } : {},
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

  async findOne(id: string): Promise<MenuItem> {
    const item = await this.menuItemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Menu item not found');
    }
    return item;
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
    const item = await this.findOne(id);
    if (updateMenuItemDto.restaurantId) {
      await this.restaurantService.findOne(updateMenuItemDto.restaurantId);
    }
    Object.assign(item, updateMenuItemDto);
    const saved = await this.menuItemRepository.save(item);
    await this.kafkaService.emit('menu-item.updated', { menuItemId: saved.id, status: saved.status });
    return saved;
  }
}
