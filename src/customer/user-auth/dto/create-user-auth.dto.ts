import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength } from "class-validator";

export class CreateUserAuthDto {

  @IsOptional()
  @IsEmail()
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



export class UserSignInDto {
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

export class UserForgotPasswordDto {
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

