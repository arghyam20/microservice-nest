import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ unique: true }) name!: string;
  @Column({ nullable: true }) imageUrl?: string;
  @Column({ type: 'varchar', default: 'ACTIVE' }) status!: string;
}
