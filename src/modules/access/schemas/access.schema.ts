import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AccessDocument = Access;

@Entity('accesses')
@Index(['slug', 'isDeleted'])
export class Access {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Generated('uuid')
  @Column({ type: 'varchar', length: 36 })
  uuid: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  name: string;

  @Column({ type: 'varchar', length: 36, nullable: true, default: null })
  parentId: any;

  @ManyToOne(() => Access, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parentId', referencedColumnName: 'uuid' })
  parent: Access;

  @Column({ type: 'varchar', length: 255, default: '' })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['Active', 'Inactive'], default: 'Active' })
  status: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export const AccessSchema = Access;
