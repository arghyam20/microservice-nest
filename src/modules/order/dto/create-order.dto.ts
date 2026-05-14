import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'Restaurant ID' })
  @IsUUID()
  restaurantId!: string;

  @ApiProperty({ example: '221B Baker Street, Kolkata' })
  @IsNotEmpty()
  @IsString()
  deliveryAddress!: string;

  @ApiPropertyOptional({ example: 'Please make it less spicy' })
  @IsOptional()
  @IsString()
  note?: string;
}
