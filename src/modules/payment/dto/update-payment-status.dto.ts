import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PaymentStatus } from '@app/common/enum/payment-status.enum';

export class UpdatePaymentStatusDto {
  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.COMPLETED })
  @IsEnum(PaymentStatus)
  status!: PaymentStatus;
}
