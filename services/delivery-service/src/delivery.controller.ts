import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { DeliveryService } from './delivery.service';
import { DeliveryStatus } from './entities/delivery.entity';

@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @MessagePattern('delivery.create')
  create(@Payload() data: any) { return this.deliveryService.create(data); }

  @MessagePattern('delivery.get')
  findOne(@Payload() data: { deliveryId: string }) { return this.deliveryService.findOne(data.deliveryId); }

  @MessagePattern('delivery.update-status')
  updateStatus(@Payload() data: { deliveryId: string; status: DeliveryStatus }) {
    return this.deliveryService.updateStatus(data.deliveryId, data.status);
  }

  @EventPattern('order.status.updated')
  onOrderStatusUpdated(@Payload() data: any) { return this.deliveryService.handleOrderStatusUpdated(data); }
}
