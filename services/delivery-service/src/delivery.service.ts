import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Delivery, DeliveryStatus } from './entities/delivery.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery) private readonly deliveryRepo: Repository<Delivery>,
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  async create(data: {
    orderId: string; userId: string; deliveryAddress: string;
    driverName?: string; driverPhone?: string; estimatedMinutes?: number;
  }): Promise<Delivery> {
    const delivery = await this.deliveryRepo.save(
      this.deliveryRepo.create({ ...data, status: DeliveryStatus.ASSIGNED }),
    );
    this.kafka.emit('delivery.status.updated', { deliveryId: delivery.id, orderId: delivery.orderId, status: delivery.status });
    return delivery;
  }

  async findOne(id: string): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findOne({ where: { id } });
    if (!delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }

  async findByOrder(orderId: string): Promise<Delivery | null> {
    return this.deliveryRepo.findOne({ where: { orderId } });
  }

  async updateStatus(id: string, status: DeliveryStatus): Promise<Delivery> {
    const delivery = await this.findOne(id);
    delivery.status = status;
    const saved = await this.deliveryRepo.save(delivery);
    this.kafka.emit('delivery.status.updated', { deliveryId: saved.id, orderId: saved.orderId, status: saved.status, userId: saved.userId });
    return saved;
  }

  // Auto-create delivery when order is confirmed
  async handleOrderStatusUpdated(data: { orderId: string; userId: string; status: string; deliveryAddress?: string }) {
    if (data.status === 'CONFIRMED') {
      await this.create({
        orderId: data.orderId,
        userId: data.userId,
        deliveryAddress: data.deliveryAddress || '',
        estimatedMinutes: 30,
      });
    }
  }
}
