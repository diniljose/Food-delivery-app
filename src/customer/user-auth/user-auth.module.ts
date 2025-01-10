import { Module } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { ResponseService } from 'src/services/response.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [UserAuthController],
  providers: [UserAuthService,ResponseService,AuthService],
})
export class UserAuthModule {}
