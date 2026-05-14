import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  async create(data: {
    userId: string; restaurantId: string; deliveryAddress: string;
    note?: string; items: { menuItemId: string; quantity: number; unitPrice: number }[];
  }): Promise<Order> {
    const totalAmount = data.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const order = await this.orderRepo.save(this.orderRepo.create({
      userId: data.userId, restaurantId: data.restaurantId,
      deliveryAddress: data.deliveryAddress, note: data.note,
      totalAmount, status: OrderStatus.PENDING,
    }));
    await this.orderItemRepo.save(data.items.map((i) => this.orderItemRepo.create({ ...i, orderId: order.id })));
    const saved = await this.findOne(order.id);
    this.kafka.emit('order.created', { orderId: saved.id, userId: saved.userId, restaurantId: saved.restaurantId, totalAmount: saved.totalAmount });
    return saved;
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.orderRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    const saved = await this.orderRepo.save(order);
    this.kafka.emit('order.status.updated', { orderId: saved.id, status: saved.status, userId: saved.userId });
    return saved;
  }
}
