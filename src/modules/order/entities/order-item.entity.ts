import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderItem {
  @ApiProperty({ description: 'Order item unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Order ID' })
  @Column()
  orderId!: string;

  @ApiProperty({ description: 'Menu item ID' })
  @Column()
  menuItemId!: string;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @Column()
  quantity!: number;

  @ApiProperty({ description: 'Unit price at order time', example: 249 })
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice!: number;

  @ManyToOne('Order', 'items')
  @JoinColumn({ name: 'orderId' })
  order?: any;

  @ManyToOne('MenuItem', { eager: true })
  @JoinColumn({ name: 'menuItemId' })
  menuItem?: any;
}
