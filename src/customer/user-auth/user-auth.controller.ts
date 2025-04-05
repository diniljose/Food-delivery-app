import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { CreateUserAuthDto, UserForgotPasswordDto, UserSignInDto } from './dto/create-user-auth.dto';
import { UpdateUserAuthDto } from './dto/update-user-auth.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseService } from 'src/services/response/response.service';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class UserAuthController {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly responseService: ResponseService,
    private readonly auth: AuthService,
    ) {}



    @Post('signUp')
    async signUpApplicant(
      @Body() dto: CreateUserAuthDto,
      @Res() res: FastifyReply,
    ): Promise<any> {
      try {
        const response = await this.userAuthService.signUp(dto);
        return res
          .status(HttpStatus.OK)
          .send(this.responseService.sendSuccessResponse({ data: response }));
      } catch (error) {
        return this.responseService.handleError(res, error);
      }
    }
    
    @Post('signIn')
    async loginApplicant(
      @Body() dto: UserSignInDto,
      @Res() res: FastifyReply,
    ): Promise<any> {
      try {
        const signInToken = await this.userAuthService.signIn(dto);
        const encryptedMobile = this.auth.encryptData(
          dto.mobileNo.toString(),
          process.env.Access_token_secret,
        );
    
        const accessToken = await this.userAuthService.generateAccessToken(
          { user: encryptedMobile },
          process.env.Access_token_secret,
          '15m',
        );
    
        const refreshToken = await this.userAuthService.generateAccessToken(
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
      @Body() dto: UserForgotPasswordDto,
      @Res() res: FastifyReply,
    ): Promise<any> {
      try {
        await this.userAuthService.resetPassword(dto);
        return res.status(HttpStatus.OK).send(
          this.responseService.sendSuccessResponse({
            data: 'Password updated successfully.',
          }),
        );
      } catch (error) {
        return this.responseService.handleError(res, error);
      }
    }
    
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserAuthDto: UpdateUserAuthDto) {
    return this.userAuthService.update(+id, updateUserAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAuthService.remove(+id);
  }
}
