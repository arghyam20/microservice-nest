import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() userId!: string;
  @Column() menuItemId!: string;
  @Column() restaurantId!: string;
  @Column() quantity!: number;
  @Column('decimal', { precision: 10, scale: 2 }) unitPrice!: number;
}
