import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}
export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  UPI = "UPI",
  WALLET = "WALLET",
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column() orderId!: string;
  @Column() userId!: string;
  @Column("decimal", { precision: 10, scale: 2 }) amount!: number;
  @Column({ type: "varchar" }) method!: PaymentMethod;
  @Column({ type: "varchar", default: PaymentStatus.PENDING })
  status!: PaymentStatus;
  @Column({ nullable: true }) transactionId?: string;
  @CreateDateColumn() createdAt!: Date;
}
