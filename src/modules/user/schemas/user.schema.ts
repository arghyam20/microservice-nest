import bcrypt, { compareSync, genSaltSync, hashSync } from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/modules/role/schemas/role.schema';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Generated('uuid')
  @Column({ type: 'varchar', length: 36 })
  uuid: string;

  @Column({ type: 'json', nullable: true })
  roles: Role[] | string[];

  @Index()
  @Column({ type: 'varchar', length: 255, default: '' })
  firstName: string;

  @Index()
  @Column({ type: 'varchar', length: 255, default: '' })
  lastName: string;

  @Index()
  @Column({ type: 'varchar', length: 255, default: '' })
  fullName: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  countryCode: string;

  @Index()
  @Column({ type: 'varchar', length: 50, default: '' })
  phone: string;

  @Index()
  @Column({ type: 'varchar', length: 255, default: '' })
  email: string;

  @Index()
  @Column({ type: 'varchar', length: 255, default: '' })
  userName: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  password: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  profileImage: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  emailOtp: string;

  @Column({ type: 'datetime', nullable: true, default: null })
  otpExpireTime: Date | null;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Index()
  @Column({ type: 'enum', enum: ['Active', 'Inactive'], default: 'Active' })
  status: string;

  @Column({ type: 'boolean', default: false })
  isAccountVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isProfileCompleted: boolean;

  @Column({ type: 'boolean', default: true })
  isPushNotification: boolean;

  @Index()
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  validPassword(password: string) {
    return compareSync(password, this.password);
  }
  generateHash(password: string) {
    return hashSync(password, genSaltSync(+(process.env.SALT_ROUND || 10)));
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeNameAndPassword() {
    if (this.fullName) {
      const nameParts = this.fullName.split(/\s+/);
      this.firstName =
        nameParts.slice(0, -1).join(' ').trim() || nameParts[0].trim();
      this.lastName =
        nameParts.length > 1 ? nameParts[nameParts.length - 1].trim() : '';
    } else if (this.firstName || this.lastName) {
      this.fullName =
        `${this.firstName?.trim() || ''} ${this.lastName?.trim() || ''}`.trim();
    }
    if (this.password && !this.password.startsWith('$2')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    }
  }
}

export type UserDocument = User;
export const UserSchema = User;
