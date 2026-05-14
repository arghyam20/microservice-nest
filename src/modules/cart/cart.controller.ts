import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartService } from './cart.service';

@ApiTags('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@GetCurrentUser('sub') userId: string, @Body() addCartItemDto: AddCartItemDto) {
    return this.cartService.addItem(userId, addCartItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  findCart(@GetCurrentUser('sub') userId: string) {
    return this.cartService.findByUser(userId);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'id' })
  updateItem(
    @GetCurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(userId, id, updateCartItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'id' })
  removeItem(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.cartService.removeItem(userId, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear current user cart' })
  clearCart(@GetCurrentUser('sub') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
