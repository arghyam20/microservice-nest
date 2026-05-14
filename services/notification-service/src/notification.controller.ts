import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('notification.send')
  send(@Payload() data: { userId: string; type: string; payload: object }) {
    return this.notificationService.send(data);
  }

  // React to domain events from other services
  @EventPattern('order.created')
  onOrderCreated(@Payload() data: any) { return this.notificationService.handleOrderCreated(data); }

  @EventPattern('order.status.updated')
  onOrderStatusUpdated(@Payload() data: any) { return this.notificationService.handleOrderStatusUpdated(data); }

  @EventPattern('payment.status.updated')
  onPaymentStatusUpdated(@Payload() data: any) { return this.notificationService.handlePaymentStatusUpdated(data); }
}
