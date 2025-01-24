import { Module } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { ResponseService } from 'src/services/response/response.service';

@Module({

  imports: [
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService,ResponseService,AuthService],
})
export class UserAuthModule {}
