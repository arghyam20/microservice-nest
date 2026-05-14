import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartItem } from "./entities/cart-item.entity";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem) private readonly cartRepo: Repository<CartItem>,
  ) {}

  async addItem(data: {
    userId: string;
    menuItemId: string;
    restaurantId: string;
    quantity: number;
    unitPrice: number;
  }): Promise<CartItem> {
    if (data.quantity < 1) {
      throw new BadRequestException("Quantity must be greater than zero");
    }

    const existing = await this.cartRepo.findOne({
      where: { userId: data.userId, menuItemId: data.menuItemId },
    });
    if (existing) {
      existing.quantity += data.quantity;
      return this.cartRepo.save(existing);
    }
    return this.cartRepo.save(this.cartRepo.create(data));
  }

  async getCart(userId: string): Promise<CartItem[]> {
    return this.cartRepo.find({ where: { userId }, order: { id: "ASC" } });
  }

  async updateItem(data: {
    userId: string;
    itemId: string;
    quantity: number;
  }): Promise<CartItem> {
    if (data.quantity < 1) {
      throw new BadRequestException("Quantity must be greater than zero");
    }

    const item = await this.cartRepo.findOne({
      where: { id: data.itemId, userId: data.userId },
    });
    if (!item) throw new NotFoundException("Cart item not found");
    item.quantity = data.quantity;
    return this.cartRepo.save(item);
  }

  async removeItem(data: { userId: string; itemId: string }): Promise<void> {
    const item = await this.cartRepo.findOne({
      where: { id: data.itemId, userId: data.userId },
    });
    if (!item) throw new NotFoundException("Cart item not found");
    await this.cartRepo.remove(item);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartRepo.delete({ userId });
  }
}
