import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() name!: string;
  @Column({ nullable: true }) description?: string;
  @Column('decimal', { precision: 10, scale: 2 }) price!: number;
  @Column() restaurantId!: string;
  @Column({ nullable: true }) categoryId?: string;
  @Column({ type: 'varchar', default: 'AVAILABLE' }) status!: string;
  @Column({ nullable: true }) imageUrl?: string;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
