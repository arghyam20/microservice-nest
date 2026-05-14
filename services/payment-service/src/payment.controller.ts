import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { PaymentMethod, PaymentStatus } from './entities/payment.entity';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('payment.create')
  create(@Payload() data: { orderId: string; userId: string; amount: number; method: PaymentMethod }) {
    return this.paymentService.create(data);
  }

  @MessagePattern('payment.list')
  findAll() { return this.paymentService.findAll(); }

  @MessagePattern('payment.get')
  findOne(@Payload() data: { paymentId: string }) { return this.paymentService.findOne(data.paymentId); }

  @MessagePattern('payment.update-status')
  updateStatus(@Payload() data: { paymentId: string; status: PaymentStatus; transactionId?: string }) {
    return this.paymentService.updateStatus(data.paymentId, data.status, data.transactionId);
  }
}
