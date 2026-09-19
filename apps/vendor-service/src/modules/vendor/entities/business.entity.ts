import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Generated('uuid')
  @Column({ type: 'varchar', length: 36 })
  uuid: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  ownerUserId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  })
  verificationStatus: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
