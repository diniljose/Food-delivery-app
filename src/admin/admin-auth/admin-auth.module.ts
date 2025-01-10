import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { ResponseService } from 'src/services/response.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [AdminAuthController],
  providers: [AdminAuthService,ResponseService,AuthService],
})
export class AdminAuthModule {}
