import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req, Res, UseInterceptors } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminForgotPasswordDto, AdminSignInDto, AdminSignUpDto } from './dto/create-admin-auth.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from 'src/auth/auth.service';
import { ResponseService } from 'src/services/response/response.service';
import { RequestValidatorInterceptor } from '../../interceptor/request-validator/request-validator.interceptor';

@Controller()
@UseInterceptors(RequestValidatorInterceptor)
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly responseService: ResponseService,
    private readonly auth: AuthService,
    ) {}

    @Post('signUp')
    async signUpApplicant(
      @Body() dto: AdminSignUpDto,
      @Res() res: FastifyReply,
    ): Promise<any> {
      try {
        const response = await this.adminAuthService.signUp(dto);
        return res
          .status(HttpStatus.OK)
          .send(this.responseService.sendSuccessResponse({ data: response }));
      } catch (error) {
        return this.responseService.handleError(res, error);
      }
    }
    


  
    @Post('signIn')
    async loginApplicant(
      @Body() dto: AdminSignInDto,
      @Res() res: FastifyReply,
    ): Promise<any> {
      try {
        const signInToken = await this.adminAuthService.signIn(dto);
        const encryptedMobile = this.auth.encryptData(
          dto.mobileNo.toString(),
          process.env.Access_token_secret,
        );
    
        const accessToken = await this.adminAuthService.generateAccessToken(
          { user: encryptedMobile },
          process.env.Access_token_secret,
          '15m',
        );
    
        const refreshToken = await this.adminAuthService.generateAccessToken(
          { user: encryptedMobile },
          process.env.Refresh_token_secret,
          '5h',
        );
    
        res.setCookie('access', accessToken, {
          httpOnly: true,
          secure: true,
          signed: true,
          sameSite: 'none',
        });
    
        res.setCookie('refresh', refreshToken, {
          httpOnly: true,
          secure: true,
          signed: true,
          sameSite: 'none',
        });
    
        return res.status(HttpStatus.OK).send(
          this.responseService.sendSuccessResponse({
            data: {
             data:"success"
            },
          }),
        );
      } catch (error) {
        return this.responseService.handleError(res, error);
      }
    }
    
    @Post('forgotPassword')
    async forgotPassword(
      @Body() dto: AdminForgotPasswordDto,
      @Res() res: FastifyReply,
    ): Promise<any> {
      try {
        await this.adminAuthService.resetPassword(dto);
        return res.status(HttpStatus.OK).send(
          this.responseService.sendSuccessResponse({
            data: 'Password updated successfully.',
          }),
        );
      } catch (error) {
        return this.responseService.handleError(res, error);
      }
    }
    

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminAuthService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminAuthService.remove(+id);
  }
}
