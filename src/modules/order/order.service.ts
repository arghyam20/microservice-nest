import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '@app/common/enum/order-status.enum';
import { KafkaService } from '../../kafka/kafka.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly kafkaService: KafkaService,
  ) {}

  async createFromCart(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const cartItems = await this.cartService.findByUser(userId);
    const restaurantItems = cartItems.filter((item) => item.menuItem?.restaurantId === createOrderDto.restaurantId);

    if (!restaurantItems.length) {
      throw new BadRequestException('Cart does not contain items for this restaurant');
    }

    const totalAmount = restaurantItems.reduce(
      (total, item) => total + Number(item.menuItem.price) * item.quantity,
      0,
    );

    const order = await this.orderRepository.save(this.orderRepository.create({
      userId,
      restaurantId: createOrderDto.restaurantId,
      deliveryAddress: createOrderDto.deliveryAddress,
      note: createOrderDto.note,
      totalAmount,
      status: OrderStatus.PENDING,
    }));

    await this.orderItemRepository.save(
      restaurantItems.map((item) =>
        this.orderItemRepository.create({
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: Number(item.menuItem.price),
        }),
      ),
    );

    await this.cartService.removeItems(userId, restaurantItems.map((item) => item.id));
    const saved = await this.findOne(order.id);
    await this.kafkaService.emit('order.created', {
      orderId: saved.id,
      userId: saved.userId,
      restaurantId: saved.restaurantId,
      totalAmount: saved.totalAmount,
    });
    return saved;
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = updateOrderStatusDto.status;
    const saved = await this.orderRepository.save(order);
    await this.kafkaService.emit('order.status.updated', { orderId: saved.id, status: saved.status });
    return saved;
  }
}
