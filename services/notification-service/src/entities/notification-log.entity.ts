import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() userId!: string;
  @Column() type!: string;
  @Column('simple-json') payload!: object;
  @Column({ default: false }) sent!: boolean;
  @CreateDateColumn() createdAt!: Date;
}
