import { ContactUs } from 'src/modules/contact-us/schemas/contact-us.schema';
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

export type AdminReplyDocument = AdminReply;

@Entity('admin_replies')
export class AdminReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Generated('uuid')
  @Column({ type: 'varchar', length: 36 })
  uuid: string;

  @Column({ type: 'int', nullable: true })
  contactId: any;

  @ManyToOne(() => ContactUs, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contactId', referencedColumnName: 'uuid' })
  contact: ContactUs;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'enum', enum: ['Active', 'Inactive'], default: 'Active' })
  status: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export const AdminReplySchema = AdminReply;
