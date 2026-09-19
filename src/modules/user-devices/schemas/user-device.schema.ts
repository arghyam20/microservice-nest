import { UserRole } from 'src/common/enum/user-role.enum';
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

class AdditionalDetails {
  name: string;
  version: string;
}

class BrowserInfo extends AdditionalDetails {}
class OperatingSystemInfo extends AdditionalDetails {}

class DeviceInfo {
  vendor: string;
  model: string;
  type: string;
}

@Entity('user_devices')
export class UserDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Generated('uuid')
  @Column({ type: 'varchar', length: 36 })
  uuid: string;

  @Index()
  @Column({ type: 'varchar', length: 36, nullable: true })
  user_id: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'uuid' })
  user: User;

  @Column({ type: 'json', nullable: true })
  webPush: object;

  @Index()
  @Column({ type: 'varchar', length: 255, default: '' })
  deviceToken: string;

  @Index()
  @Column({ type: 'enum', enum: ['Web', 'Android', 'iOS'], default: 'Web' })
  deviceType: string;

  @Index()
  @Column({ type: 'varchar', length: 100, default: '' })
  ip: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  ip_lat: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  ip_long: string;

  @Column({ type: 'json', nullable: true })
  browserInfo: BrowserInfo;

  @Column({ type: 'json', nullable: true })
  deviceInfo: DeviceInfo;

  @Column({ type: 'json', nullable: true })
  operatingSystem: OperatingSystemInfo;

  @Index()
  @Column({ type: 'datetime', nullable: true, default: null })
  last_active: Date | number | null;

  @Column({ type: 'varchar', length: 255, default: '' })
  state: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  country: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  city: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  timezone: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 1024, nullable: true, default: null })
  accessToken: string | null;

  @Index()
  @Column({ type: 'boolean', default: false })
  expired: boolean;

  @Index()
  @Column({ type: 'enum', enum: UserRole, nullable: true })
  role: string;

  @Index()
  @Column({ type: 'boolean', default: false })
  isLoggedOut: boolean;

  @Index()
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export type UserDeviceDocument = UserDevice;
export const UserDeviceSchema = UserDevice;
