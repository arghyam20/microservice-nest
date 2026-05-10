import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryStatus } from '@app/common/enum/category-status.enum';

@Entity()
export class Category {
  @ApiProperty({
    description: 'Category unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
  })
  @Column({ unique: true })
  name!: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Electronic devices and accessories',
  })
  @Column({ nullable: true })
  description?: string;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: '/uploads/category-image.jpg',
  })
  @Column({ nullable: true })
  imageUrl?: string;

  @ApiProperty({
    description: 'Category status',
    example: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE'],
  })
  @Column({
    type: 'varchar',
    default: CategoryStatus.ACTIVE,
  })
  status!: CategoryStatus;
}
