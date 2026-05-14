import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { OrderStatus } from './entities/order.entity';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('order.create')
  create(@Payload() data: any) { return this.orderService.create(data); }

  @MessagePattern('order.list')
  findAll(@Payload() data: { userId: string }) { return this.orderService.findAllByUser(data.userId); }

  @MessagePattern('order.get')
  findOne(@Payload() data: { orderId: string }) { return this.orderService.findOne(data.orderId); }

  @MessagePattern('order.update-status')
  updateStatus(@Payload() data: { orderId: string; status: OrderStatus }) {
    return this.orderService.updateStatus(data.orderId, data.status);
  }
}
