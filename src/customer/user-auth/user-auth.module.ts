import { Module } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { ResponseService } from 'src/services/response/response.service';
import { UserSignUp, UserSignUpSchema } from '../../schemas/user-auth.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({

  imports: [
    MongooseModule.forFeature([
      { name: UserSignUp.name, schema: UserSignUpSchema },
    ])
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService,ResponseService,AuthService],
})
export class UserAuthModule {}
