import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Payment, PaymentMethod, PaymentStatus } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  async create(data: { orderId: string; userId: string; amount: number; method: PaymentMethod }): Promise<Payment> {
    const payment = await this.paymentRepo.save(
      this.paymentRepo.create({ ...data, status: PaymentStatus.PENDING }),
    );
    this.kafka.emit('payment.created', { paymentId: payment.id, orderId: payment.orderId, userId: payment.userId });
    return payment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async updateStatus(id: string, status: PaymentStatus, transactionId?: string): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = status;
    if (transactionId) payment.transactionId = transactionId;
    const saved = await this.paymentRepo.save(payment);
    this.kafka.emit('payment.status.updated', { paymentId: saved.id, orderId: saved.orderId, status: saved.status, userId: saved.userId });
    return saved;
  }
}
