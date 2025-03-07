import { IsNotEmpty, IsOptional } from "class-validator";

export class CategoryDto {
    @IsNotEmpty()
    name: string;
    
    @IsOptional()
    description: string;

    @IsNotEmpty()
    @IsOptional()
    fileUrl:string
  }
  