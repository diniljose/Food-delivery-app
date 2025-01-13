import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { ResponseService } from 'src/services/response/response.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSignUp, AdminSignUpSchema } from 'src/schemas/admin-auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminSignUp.name, schema: AdminSignUpSchema },
    ])
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, ResponseService, AuthService],
})
export class AdminAuthModule { }
