import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { UpdateUserAuthDto } from './dto/update-user-auth.dto';
import { AuthService } from '../../auth/auth.service';
import { UserSignUp } from '../../schemas/user-auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseService } from 'src/services/response/response.service';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly auth: AuthService,
    
  @InjectModel(UserSignUp.name) private UserSignUpModel: Model<UserSignUp>,

    ){}

  async signUpUser(dto: CreateUserAuthDto): Promise<{ message: string }> {
    try {
      const existingApplicant = await this.UserSignUpModel
        .findOne({ email: dto.email })
        .exec();
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
      const newApplicant = new this.UserSignUpModel(dto);
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
