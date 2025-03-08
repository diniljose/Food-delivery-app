
import { IsString, IsNumber, IsOptional, IsNumberString } from 'class-validator';

export class CreateCartDto {
  @IsString()
  readonly itemId: string;

  @IsString()
  mobileNoCountryCode: string;

  @IsNumber()
  mobileNo:number;

  @IsNumberString()
  readonly quantity: number;

  @IsString()
  readonly unitId: string;

  @IsOptional()
  readonly customization?: any; // Optional customization (e.g., toppings, extras)
}
