
import { IsString, IsNumber, IsOptional, IsNumberString, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsOptional()
  @IsString()
  readonly itemId: string;

  @IsString()
  @IsNotEmpty()
  mobileNoCountryCode: string;

  @IsNumber()
  @IsNotEmpty()
  mobileNo:number;

  @IsNumberString()
  @IsOptional()
  readonly quantity: number;

  @IsString()
  @IsOptional()
  readonly unitId: string;

  @IsOptional()
  @IsOptional()
  readonly customization?: any; // Optional customization (e.g., toppings, extras)
}
