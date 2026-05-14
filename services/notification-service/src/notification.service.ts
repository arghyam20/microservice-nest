import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationLog } from './entities/notification-log.entity';

@Injectable()
export class NotificationService {
  constructor(@InjectRepository(NotificationLog) private readonly logRepo: Repository<NotificationLog>) {}

  async send(data: { userId: string; type: string; payload: object }): Promise<NotificationLog> {
    // In production: integrate email/SMS/push provider here
    console.log(`[Notification] type=${data.type} userId=${data.userId}`, data.payload);
    return this.logRepo.save(this.logRepo.create({ ...data, sent: true }));
  }

  async handleOrderCreated(data: { orderId: string; userId: string; totalAmount: number }) {
    return this.send({ userId: data.userId, type: 'ORDER_PLACED', payload: data });
  }

  async handleOrderStatusUpdated(data: { orderId: string; userId: string; status: string }) {
    return this.send({ userId: data.userId, type: `ORDER_${data.status}`, payload: data });
  }

  async handlePaymentStatusUpdated(data: { paymentId: string; userId: string; status: string }) {
    return this.send({ userId: data.userId, type: `PAYMENT_${data.status}`, payload: data });
  }
}
