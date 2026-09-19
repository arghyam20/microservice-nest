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
} from 'typeorm';

@Entity('refreshTokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Generated('uuid')
  @Column({ type: 'varchar', length: 36 })
  uuid: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  hash: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  userId: any;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'uuid' })
  user: User;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}

export type RefreshTokenDocument = RefreshToken;
export const RefreshTokenSchema = RefreshToken;
