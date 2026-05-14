import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RestaurantStatus } from '@app/common/enum/restaurant-status.enum';

@Entity()
export class Restaurant {
  @ApiProperty({ description: 'Restaurant unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Restaurant name', example: 'Spice Kitchen' })
  @Column({ unique: true })
  name!: string;

  @ApiPropertyOptional({ description: 'Restaurant description' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ description: 'Restaurant address' })
  @Column()
  address!: string;

  @ApiPropertyOptional({ description: 'Restaurant phone number' })
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ enum: RestaurantStatus, example: RestaurantStatus.OPEN })
  @Column({ type: 'varchar', default: RestaurantStatus.OPEN })
  status!: RestaurantStatus;

  @OneToMany('MenuItem', 'restaurant')
  menuItems?: any[];
}
