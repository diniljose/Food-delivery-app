import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserAuthDto, UserForgotPasswordDto, UserSignInDto } from './dto/create-user-auth.dto';
import { UpdateUserAuthDto } from './dto/update-user-auth.dto';
import { AuthService } from '../../auth/auth.service';
import { UserSignUp } from '../../schemas/user-auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseService } from 'src/services/response/response.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly auth: AuthService,

    @InjectModel(UserSignUp.name) private AdminSignUpModel: Model<UserSignUp>,

  ) { }

  async signUp(dto: CreateUserAuthDto): Promise<{ message: string }> {
    try {
      const existingApplicant = await this.AdminSignUpModel.findOne({
        mobileNo: dto.mobileNo,
        mobileNoCountryCode: dto.mobileNoCountryCode,
      }).lean();

      if (existingApplicant) {
        throw new BadRequestException({
          englishMessage:
            'An applicant with this mobile number already exists. Please sign in.',
          arabicMessage:
            'يوجد متقدم بالفعل بهذا الرقم. الرجاء تسجيل الدخول.',
        });
      }

      dto.password = await this.auth.hashPassword(dto.password);

      const newApplicant = new this.AdminSignUpModel(dto);
      const savedApplicant = await newApplicant.save();

      if (!savedApplicant) {
        throw new BadRequestException({
          englishMessage: 'Error while creating applicant.',
          arabicMessage: 'حدث خطأ أثناء إنشاء المتقدم.',
        });
      }

      return { message: 'Sign up successful' };
    } catch (error) {
      this.responseService.handleErrorservice(error);
    }
  }

  async signIn(dto: UserSignInDto): Promise<any> {
    try {
      const user = await this.AdminSignUpModel.findOne({
        mobileNo: dto.mobileNo,
        mobileNoCountryCode: dto.mobileNoCountryCode,
      })
        .select('password')
        .sort({ updatedAt: -1 })
        .lean();

      if (!user) {
        throw new BadRequestException({
          englishMessage: 'User does not exist, please sign up.',
          arabicMessage: 'المستخدم غير موجود، يرجى التسجيل.',
        });
      }

      const isPasswordValid = await this.auth.comparePassword(
        dto.password,
        user.password,
      );

      console.log(isPasswordValid);


      if (!isPasswordValid) {
        throw new BadRequestException({
          englishMessage: 'Invalid password',
          arabicMessage: 'كلمة المرور غير صحيحة',
        });
      }

      return user;
    } catch (error) {
      console.log(error);

      this.responseService.handleErrorservice(error);
    }
  }

  async resetPassword(dto: UserForgotPasswordDto): Promise<void> {
    try {
      const user = await this.AdminSignUpModel.findOne({
        mobileNo: dto.mobileNo,
        mobileNoCountryCode: dto.mobileNoCountryCode,
      });

      if (!user) {
        throw new BadRequestException({
          englishMessage: 'This user does not exist.',
          arabicMessage: 'هذا المستخدم غير موجود.',
        });
      }

      const hashedPassword = await this.auth.hashPassword(dto.password);
      user.password = hashedPassword;
      await user.save();
    } catch (error) {
      this.responseService.handleErrorservice(error);
    }
  }

  async generateAccessToken(user, token, time) {
    return jwt.sign(user, token, { expiresIn: time });
    //return jwt.sign(user, token);
  }

  findAll() {
    return `This action returns all userAuth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userAuth`;
  }

  update(id: number, updateUserAuthDto: UpdateUserAuthDto) {
    return `This action updates a #${id} userAuth`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAuth`;
  }
}
