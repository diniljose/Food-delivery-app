import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength, isString } from "class-validator";


export class AdminSignUpDto {
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
  mobileNoCountryCode?: string;

  @IsOptional()
  @IsNumber()
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


export class AdminForgotPasswordDto{
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    email: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class AdminSignInDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(5) // Ensure a minimum length for the new password
    password: string;
  }
  
