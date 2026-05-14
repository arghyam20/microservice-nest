import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentStatus } from '@app/common/enum/payment-status.enum';
import { KafkaService } from '../../kafka/kafka.service';
import { OrderService } from '../order/order.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly orderService: OrderService,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const order = await this.orderService.findOne(createPaymentDto.orderId);
    const payment = await this.paymentRepository.save(
      this.paymentRepository.create({
        ...createPaymentDto,
        amount: Number(order.totalAmount),
        status: PaymentStatus.PENDING,
      }),
    );

    await this.kafkaService.emit('payment.created', { paymentId: payment.id, orderId: payment.orderId });
    return payment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async updateStatus(id: string, updatePaymentStatusDto: UpdatePaymentStatusDto): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = updatePaymentStatusDto.status;
    const saved = await this.paymentRepository.save(payment);
    await this.kafkaService.emit('payment.status.updated', {
      paymentId: saved.id,
      orderId: saved.orderId,
      status: saved.status,
    });
    return saved;
  }
}
