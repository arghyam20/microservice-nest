import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { MenuItemStatus } from '@app/common/enum/menu-item-status.enum';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Paneer Butter Masala' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 249 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Restaurant ID' })
  @IsUUID()
  restaurantId!: string;

  @ApiPropertyOptional({ enum: MenuItemStatus, example: MenuItemStatus.AVAILABLE })
  @IsOptional()
  @IsEnum(MenuItemStatus)
  status?: MenuItemStatus;
}
