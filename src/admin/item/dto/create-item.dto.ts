import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, ValidateNested } from "class-validator";


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
    @IsNotEmpty()
    category: string;
  
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
  
    @IsNumber()
    @Min(0)
    price: number;
  
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
    @IsOptional()
    @Min(0)
    price?: number;
  
    @IsNumber()
    @IsOptional()
    @Min(0)
    stock?: number;
  
    @IsString()
    @IsOptional()
    unitId?: string;
  }
  
  

  
