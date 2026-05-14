import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum DeliveryStatus {
  ASSIGNED = 'ASSIGNED', PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT', DELIVERED = 'DELIVERED', FAILED = 'FAILED',
}

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() orderId!: string;
  @Column() userId!: string;
  @Column({ nullable: true }) driverName?: string;
  @Column({ nullable: true }) driverPhone?: string;
  @Column() deliveryAddress!: string;
  @Column({ type: 'varchar', default: DeliveryStatus.ASSIGNED }) status!: DeliveryStatus;
  @Column({ nullable: true }) estimatedMinutes?: number;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
