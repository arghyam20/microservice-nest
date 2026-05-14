import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderStatus } from '@app/common/enum/order-status.enum';

@Entity()
export class Order {
  @ApiProperty({ description: 'Order unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId!: string;

  @ApiProperty({ description: 'Restaurant ID' })
  @Column()
  restaurantId!: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  @Column({ type: 'varchar', default: OrderStatus.PENDING })
  status!: OrderStatus;

  @ApiProperty({ description: 'Order total amount', example: 498 })
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount!: number;

  @ApiProperty({ description: 'Delivery address' })
  @Column()
  deliveryAddress!: string;

  @ApiPropertyOptional({ description: 'Customer note' })
  @Column({ nullable: true })
  note?: string;

  @ManyToOne('User', { eager: true })
  @JoinColumn({ name: 'userId' })
  user?: any;

  @ManyToOne('Restaurant', { eager: true })
  @JoinColumn({ name: 'restaurantId' })
  restaurant?: any;

  @OneToMany('OrderItem', 'order', { cascade: true, eager: true })
  items!: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
