import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(@Inject('CART_SERVICE') private readonly cartClient: ClientKafka) {}

  @Post('items')
  addItem(@Req() req: any, @Body() body: any) {
    return firstValueFrom(this.cartClient.send('cart.add-item', { userId: req.user.sub, ...body }));
  }

  @Get()
  getCart(@Req() req: any) {
    return firstValueFrom(this.cartClient.send('cart.get', { userId: req.user.sub }));
  }

  @Patch('items/:id')
  updateItem(@Req() req: any, @Param('id') id: string, @Body() body: { quantity: number }) {
    return firstValueFrom(this.cartClient.send('cart.update-item', { userId: req.user.sub, itemId: id, quantity: body.quantity }));
  }

  @Delete('items/:id')
  removeItem(@Req() req: any, @Param('id') id: string) {
    return firstValueFrom(this.cartClient.send('cart.remove-item', { userId: req.user.sub, itemId: id }));
  }

  @Delete()
  clearCart(@Req() req: any) {
    return firstValueFrom(this.cartClient.send('cart.clear', { userId: req.user.sub }));
  }
}
