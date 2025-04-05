import { IsOptional, IsEmail, IsNotEmpty, IsString, Length, IsNumber, IsDate, MinLength } from "class-validator";

export class AdminSignUpDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
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

  @IsNotEmpty()
  @IsString()
  mobileNoCountryCode: string;

  @IsNotEmpty()
  @IsNumber()
  mobileNo: number;

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

export class AdminSignInDto {
  @IsNotEmpty()
  @IsString()
  mobileNoCountryCode: string;

  @IsNotEmpty()
  @IsNumber()
  mobileNo: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}

export class AdminForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  mobileNoCountryCode: string;

  @IsNotEmpty()
  @IsNumber()
  mobileNo: number;

  @IsNotEmpty()
  @IsString()
  password: string;
}
