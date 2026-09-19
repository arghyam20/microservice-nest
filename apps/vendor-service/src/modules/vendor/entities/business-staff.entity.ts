import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('business_staff')
@Index(['businessId', 'userId'], { unique: true })
export class BusinessStaff {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Generated('uuid')
  @Column({ type: 'varchar', length: 36 })
  uuid: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  businessId: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'varchar', length: 64 })
  role: string;

  @Column({ type: 'json', nullable: true })
  permissions: string[] | null;

  @Column({
    type: 'enum',
    enum: ['INVITED', 'ACTIVE', 'INACTIVE'],
    default: 'INVITED',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
