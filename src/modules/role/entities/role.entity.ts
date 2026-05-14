import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Role {
  @ApiProperty({
    description: 'Role unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Role name',
    example: 'admin',
  })
  @Column({ unique: true })
  name!: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Administrator role with full access',
  })
  @Column({ nullable: true })
  description?: string;

}
