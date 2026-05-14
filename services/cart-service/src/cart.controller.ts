import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern('cart.add-item')
  addItem(@Payload() data: { userId: string; menuItemId: string; restaurantId: string; quantity: number; unitPrice: number }) {
    return this.cartService.addItem(data);
  }

  @MessagePattern('cart.get')
  getCart(@Payload() data: { userId: string }) { return this.cartService.getCart(data.userId); }

  @MessagePattern('cart.update-item')
  updateItem(@Payload() data: { userId: string; itemId: string; quantity: number }) {
    return this.cartService.updateItem(data);
  }

  @MessagePattern('cart.remove-item')
  removeItem(@Payload() data: { userId: string; itemId: string }) { return this.cartService.removeItem(data); }

  @MessagePattern('cart.clear')
  clearCart(@Payload() data: { userId: string }) { return this.cartService.clearCart(data.userId); }
}
