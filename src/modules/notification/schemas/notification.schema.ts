import { NotificationType } from 'src/common/enum/notification-type.enum';
import { Category } from 'src/modules/category/schemas/category.schema';
import { User } from 'src/modules/user/schemas/user.schema';
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

export type NotificationDocument = Notification;

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Generated('uuid')
  @Column({ type: 'varchar', length: 36 })
  uuid: string;

  @Index()
  @Column({ type: 'varchar', length: 36, nullable: true, default: null })
  userId: any;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'uuid' })
  user: User;

  @Index()
  @Column({ type: 'varchar', length: 36, nullable: true, default: null })
  receiverUserId: any;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'receiverUserId', referencedColumnName: 'uuid' })
  receiverUser: User;

  @Column({ type: 'varchar', length: 255, default: '' })
  title: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Index()
  @Column({ type: 'varchar', length: 36, nullable: true, default: null })
  categoryId: string | null;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'uuid' })
  category: Category;

  @Index()
  @Column({ type: 'varchar', length: 36, nullable: true, default: null })
  subCategoryId: string | null;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subCategoryId', referencedColumnName: 'uuid' })
  subCategory: Category;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SECTION_SUBMITTED,
  })
  type: NotificationType;

  @Column({ type: 'json', nullable: true })
  data: any;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'datetime', nullable: true, default: null })
  readAt: Date | null;

  @Column({ type: 'enum', enum: ['Active', 'Inactive'], default: 'Active' })
  status: 'Active' | 'Inactive';

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export const NotificationSchema = Notification;
