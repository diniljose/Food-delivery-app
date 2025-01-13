import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminSignUpDto } from './dto/create-admin-auth.dto';
import { AuthService } from 'src/auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { AdminSignUp } from '../../schemas/admin-auth.schema';
import { Model } from 'mongoose';
import { ResponseService } from 'src/services/response/response.service';

@Injectable()
export class AdminAuthService {
    
    constructor(
      private readonly responseService: ResponseService,
      private readonly auth: AuthService,
      
    @InjectModel(AdminSignUp.name) private AdminSignUpModel: Model<AdminSignUp>,
  
      ){}

  async signUp(dto: AdminSignUpDto): Promise<{ message: string }> {
    try {
      const existingApplicant = await this.AdminSignUpModel
        .findOne({ email: dto.email })
        .exec();

        console.log(existingApplicant);
        
      if (existingApplicant) {
        throw new BadRequestException({
          englishMessage:
            'An applicant with email already exists. Please sign in.',
          arabicMessage:
            'يوجد متقدم بالفعل بنفس البريد الإلكتروني. الرجاء تسجيل الدخول.',
        });
      }
      dto.password = await this.auth.hashPassword(dto.password);
      // dto.applicantId = generateUniqueCode(dto.givenName, 4);
      const newApplicant = new this.AdminSignUpModel(dto);
      const savedApplicant = await newApplicant.save();
      if (!savedApplicant) {
        throw new BadRequestException({
          englishMessage: 'Error while creating applicant.',
          arabicMessage: 'حدث خطأ أثناء إنشاء المتقدم.',
        });

        // throw new BadRequestException('Error while creating applicant');
      }
      return { message: 'Sign up successful' };
    } catch (error) {
      this.responseService.handleErrorservice(error);
    }
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    try {
      const user = await this.AdminSignUpModel.findOne({ email }).exec();

      if (!user) {
        throw new BadRequestException({
          englishMessage: 'This user does not exist.',
          arabicMessage: 'هذا المستخدم غير موجود.',
        });
      }

      // Hash the new password
      const hashedPassword = await this.auth.hashPassword(newPassword);

      user.password = hashedPassword;
      await user.save();
    } catch (error) {
      this.responseService.handleErrorservice(error);
    }
  }

  async signIn(email: string, password): Promise<any> {
    try {
      const isApplicatExit = await this.AdminSignUpModel
        .findOne({
          email: email,
        })
        .select('email givenName password applicantId preferredLanguage')
        .sort({ updatedAt: -1 })
        .exec();
      if (!isApplicatExit) {
        throw new BadRequestException({
          englishMessage: 'User does not exist, please sign up.',
          arabicMessage: 'المستخدم غير موجود، يرجى التسجيل.',
        });
      }

      const isPasswordValid = await this.auth.comparePassword(
        password,
        isApplicatExit.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException({
          englishMessage: 'Invalid password',
          arabicMessage: 'كلمة المرور غير صحيحة',
        });
      }

      return await isApplicatExit;
      // return token;
    } catch (error) {
      this.responseService.handleErrorservice(error);
    }
  }




  async generateAccessToken(user, token, time) {
    return jwt.sign(user, token, { expiresIn: time });
    //return jwt.sign(user, token);
  }


  findAll() {
    return `This action returns all adminAuth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminAuth`;
  }


  remove(id: number) {
    return `This action removes a #${id} adminAuth`;
  }
}
