import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartItem {
  @ApiProperty({ description: 'Cart item unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId!: string;

  @ApiProperty({ description: 'Menu item ID' })
  @Column()
  menuItemId!: string;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @Column()
  quantity!: number;

  @ManyToOne('User', { eager: true })
  @JoinColumn({ name: 'userId' })
  user?: any;

  @ManyToOne('MenuItem', { eager: true })
  @JoinColumn({ name: 'menuItemId' })
  menuItem?: any;
}
