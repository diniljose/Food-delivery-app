import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateUserAuthDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    @Length(8, 32, {
      message: 'Password must be between 8 and 32 characters.',
    })
    password: string;
  
    @IsOptional()
    @IsString()
    surname?: string;
  
    @IsOptional()
    @IsString()
    givenName?: string;
  
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    mobileNoCountryCode?: string;
  
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    mobileNo?: number;
  
    @IsOptional()
    @IsString()
    access_token?: string;
  
    @IsOptional()
    @IsString()
    prefredLanguage?: string;
  
    @IsOptional()
    @IsString()
    verificationCode?: string;
  
    @IsOptional()
    @IsDate()
    otpCreatedTime?: Date;
  
}
