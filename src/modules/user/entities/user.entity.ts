import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Column({ unique: true })
  email!: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Column()
  name!: string;

  @ApiProperty({
    description: 'User password (excluded from responses)',
    example: 'hashedpassword123',
  })
  @Column()
  @Exclude()
  password!: string;

  @ApiPropertyOptional({
    description: 'User refresh token (excluded from responses)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @ApiPropertyOptional({
    description: 'User role',
    type: () => Object,
  })
  @ManyToOne('Role', 'users', { eager: true, nullable: true })
  @JoinColumn()
  role?: any;
}
