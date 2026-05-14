import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentMethod } from '@app/common/enum/payment-method.enum';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Order ID' })
  @IsUUID()
  orderId!: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.UPI })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiPropertyOptional({ description: 'Payment provider reference' })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
