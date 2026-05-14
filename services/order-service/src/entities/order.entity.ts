import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum OrderStatus {
  PENDING = 'PENDING', CONFIRMED = 'CONFIRMED', PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', DELIVERED = 'DELIVERED', CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() userId!: string;
  @Column() restaurantId!: string;
  @Column('decimal', { precision: 10, scale: 2 }) totalAmount!: number;
  @Column() deliveryAddress!: string;
  @Column({ nullable: true }) note?: string;
  @Column({ type: 'varchar', default: OrderStatus.PENDING }) status!: OrderStatus;
  @OneToMany('OrderItem', 'order', { cascade: true, eager: true }) items!: any[];
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
