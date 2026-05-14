import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MenuItemStatus } from '@app/common/enum/menu-item-status.enum';

@Entity()
export class MenuItem {
  @ApiProperty({ description: 'Menu item unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Food item name', example: 'Paneer Butter Masala' })
  @Column()
  name!: string;

  @ApiPropertyOptional({ description: 'Food item description' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ description: 'Food item price', example: 249 })
  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @ApiPropertyOptional({ description: 'Food item image URL' })
  @Column({ nullable: true })
  imageUrl?: string;

  @ApiProperty({ enum: MenuItemStatus, example: MenuItemStatus.AVAILABLE })
  @Column({ type: 'varchar', default: MenuItemStatus.AVAILABLE })
  status!: MenuItemStatus;

  @ApiProperty({ description: 'Restaurant ID' })
  @Column()
  restaurantId!: string;

  @ManyToOne('Restaurant', 'menuItems', { eager: true })
  @JoinColumn({ name: 'restaurantId' })
  restaurant?: any;
}
