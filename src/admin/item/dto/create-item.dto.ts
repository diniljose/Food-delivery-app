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


  export class ItemDetailsDto {
    @IsString()
    @IsNotEmpty()
    fileUrl: string;


    @IsString()
    @IsNotEmpty({ message: 'Item name is required' })
    itemName: string;
  
    @IsString()
    @IsNotEmpty({ message: 'Category is required' })
    category: string; // e.g., seafood, chicken, vegetarian
  
    @IsString()
    @IsNotEmpty({ message: 'Cuisine type is required' })
    cuisine: string; // e.g., Italian, Indian, Chinese
  
    @IsNumber()
    @IsPositive({ message: 'Price must be a positive number' })
    price: number;
  
    @IsNumber()
    @Min(1, { message: 'Minimum quantity must be at least 1' })
    quantity: number;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one ingredient is required' })
    @IsString({ each: true, message: 'Each ingredient must be a string' })
    ingredients: string[];
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true, message: 'Each tag must be a string' })
    tags?: string[]; // e.g., spicy, gluten-free, vegan
  }
  

  
