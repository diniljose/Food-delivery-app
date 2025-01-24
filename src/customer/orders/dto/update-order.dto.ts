import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, IsNumber, IsMongoId, IsOptional, ValidateNested } from 'class-validator';

class OrderItemDto {
  @IsMongoId()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsMongoId()
  @IsNotEmpty()
  unitId: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status: string; // e.g., 'Pending', 'Confirmed', 'Shipped', 'Delivered'

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Validates each item in the array
  @Type(() => OrderItemDto) // Converts plain objects to instances of OrderItemDto
  items?: OrderItemDto[];

  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}