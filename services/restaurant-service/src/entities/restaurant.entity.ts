import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum RestaurantStatus { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE', SUSPENDED = 'SUSPENDED' }

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() name!: string;
  @Column() address!: string;
  @Column({ nullable: true }) phone?: string;
  @Column({ nullable: true }) cuisineType?: string;
  @Column({ type: 'varchar', default: RestaurantStatus.ACTIVE }) status!: RestaurantStatus;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
