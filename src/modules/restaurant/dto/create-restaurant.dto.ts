import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RestaurantStatus } from '@app/common/enum/restaurant-status.enum';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Spice Kitchen' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Salt Lake, Kolkata' })
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiPropertyOptional({ example: '+91-9876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: RestaurantStatus, example: RestaurantStatus.OPEN })
  @IsOptional()
  @IsEnum(RestaurantStatus)
  status?: RestaurantStatus;
}
