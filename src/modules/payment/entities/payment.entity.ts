import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethod } from '@app/common/enum/payment-method.enum';
import { PaymentStatus } from '@app/common/enum/payment-status.enum';

@Entity()
export class Payment {
  @ApiProperty({ description: 'Payment unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Order ID' })
  @Column()
  orderId!: string;

  @ApiProperty({ description: 'Paid amount', example: 498 })
  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.UPI })
  @Column({ type: 'varchar' })
  method!: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PENDING })
  @Column({ type: 'varchar', default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @ApiPropertyOptional({ description: 'Payment provider reference' })
  @Column({ nullable: true })
  transactionId?: string;

  @ManyToOne('Order', { eager: true })
  @JoinColumn({ name: 'orderId' })
  order?: any;

  @CreateDateColumn()
  createdAt!: Date;
}
