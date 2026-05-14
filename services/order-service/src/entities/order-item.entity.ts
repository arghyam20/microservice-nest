import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() orderId!: string;
  @Column() menuItemId!: string;
  @Column() quantity!: number;
  @Column('decimal', { precision: 10, scale: 2 }) unitPrice!: number;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'orderId' })
  order!: Order;
}
