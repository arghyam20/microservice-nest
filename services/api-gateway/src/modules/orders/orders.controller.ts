import { Body, Controller, Get, Inject, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(@Inject('ORDER_SERVICE') private readonly orderClient: ClientKafka) {}

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return firstValueFrom(this.orderClient.send('order.create', { userId: req.user.sub, ...body }));
  }

  @Get()
  findAll(@Req() req: any) {
    return firstValueFrom(this.orderClient.send('order.list', { userId: req.user.sub }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(this.orderClient.send('order.get', { orderId: id }));
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return firstValueFrom(this.orderClient.send('order.update-status', { orderId: id, status: body.status }));
  }
}
