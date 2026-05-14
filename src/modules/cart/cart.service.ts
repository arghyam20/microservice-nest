import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemStatus } from '@app/common/enum/menu-item-status.enum';
import { MenuItemService } from '../menu-item/menu-item.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly menuItemService: MenuItemService,
  ) {}

  async addItem(userId: string, addCartItemDto: AddCartItemDto): Promise<CartItem> {
    const menuItem = await this.menuItemService.findOne(addCartItemDto.menuItemId);
    if (menuItem.status !== MenuItemStatus.AVAILABLE) {
      throw new BadRequestException('Menu item is not available');
    }

    const existing = await this.cartItemRepository.findOne({
      where: { userId, menuItemId: addCartItemDto.menuItemId },
    });

    if (existing) {
      existing.quantity += addCartItemDto.quantity;
      return this.cartItemRepository.save(existing);
    }

    return this.cartItemRepository.save(this.cartItemRepository.create({ userId, ...addCartItemDto }));
  }

  async findByUser(userId: string): Promise<CartItem[]> {
    return this.cartItemRepository.find({ where: { userId }, order: { id: 'ASC' } });
  }

  async updateItem(userId: string, id: string, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
    const item = await this.findOwnedItem(userId, id);
    item.quantity = updateCartItemDto.quantity;
    return this.cartItemRepository.save(item);
  }

  async removeItem(userId: string, id: string): Promise<void> {
    const item = await this.findOwnedItem(userId, id);
    await this.cartItemRepository.remove(item);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartItemRepository.delete({ userId });
  }

  async removeItems(userId: string, ids: string[]): Promise<void> {
    const items = await this.cartItemRepository.find({ where: { userId } });
    await this.cartItemRepository.remove(items.filter((item) => ids.includes(item.id)));
  }

  private async findOwnedItem(userId: string, id: string): Promise<CartItem> {
    const item = await this.cartItemRepository.findOne({ where: { id, userId } });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    return item;
  }
}
