import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDecimal, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, IsString, Min, ValidateNested } from "class-validator";


export class FileDto {
  @IsNotEmpty()
  // @AllowedFileNames({ message: 'File name must be one of the allowed names' })
  filename: string;

  @IsNotEmpty()
  // @AllowedFileNames({ message: 'File name must be one of the allowed names' })
  data: Buffer;

  @IsString()
  encoding: string;

  @IsBoolean()
  limit: boolean;

  @IsNotEmpty()
  mimetype: string; // In bytes
}
export class CreateItemRequestDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  categoryId: string;


  @IsNumberString()
  readonly discountPrice: number;

  @IsString()
  @IsNotEmpty()
  cuisine: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  @IsOptional()
  imageUrls?: string[];

  @IsNumber()
  price: number; // Treat price as a string to handle decimals

  @IsNumber()
  @Min(0)
  stock: number; 

  @IsString()
  @IsNotEmpty()
  unitId: string;
}

export class UpdateItemRequestDto {
  @IsString()
  @IsOptional()
  itemName?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  cuisine?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ingredients?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsNumber()
  @IsOptional() // Now it’s optional
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional() // Now it’s optional
  @Min(0)
  stock?: number;

  @IsString()
  @IsOptional()
  unitId?: string;
}




