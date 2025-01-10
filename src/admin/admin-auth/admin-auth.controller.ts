import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req, Res } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminForgotPasswordDto, AdminSignInDto, AdminSignUpDto } from './dto/create-admin-auth.dto';
import { ResponseService } from 'src/services/response.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from 'src/auth/auth.service';
import { AdminSignUp } from 'src/schemas/admin-auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly responseService: ResponseService,
    private readonly auth: AuthService,
    ) {}

  
  @Post('signUp')
  async signUpApplicant(
    @Body() dto: AdminSignUpDto,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
      // Check if mobileNoCountryCode is defined before calling toUpperCase
      dto.email = dto.email.toLowerCase();
      

      // Pass the DTO to the service
      const signUpResponse = await this.adminAuthService.signUp(dto);

      return res
        .status(HttpStatus.OK)
        .send(
          this.responseService.sendSuccessResponse({ data: signUpResponse }),
        );
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
      let { password } = dto;

      dto.email = dto.email.toLowerCase();

      const signInToken = await this.adminAuthService.signIn(
        dto.email,
        password,
      );

      const encryptedEmail = this.auth.encryptData(
        dto?.email,
        process.env.Access_token_secret,
      );
      const accessToken = await this.adminAuthService.generateAccessToken(
        { ehhhhjjjjghgh: encryptedEmail },
        process.env.Access_token_secret,
        '15m',
      );
      const refreshToken =
        await this.adminAuthService.generateAccessToken(
          { ehhhhjjjjghgh: encryptedEmail },
          process.env.Refresh_token_secret,
          '5h',
        );

      res.setCookie('adfsrfgerfgerf', accessToken, {
        httpOnly: true,
        secure: true,
        signed: true,
        sameSite: 'none',
      });

      res.setCookie('rxcvdfrgvedrfg', refreshToken, {
        httpOnly: true,
        secure: true,
        signed: true,
        sameSite: 'none',
      });
      return res.status(HttpStatus.OK).send(
        this.responseService.sendSuccessResponse({
          data: {
            email: signInToken.email,
            applicantId: signInToken.applicantId,
            givenName: signInToken.givenName,
            preferredLanguage: signInToken.preferredLanguage,
          },
        }),
      );
    } catch (error) {
      return this.responseService.handleError(res, error);
    }
  }


  @Post('forgotPassword')
  async forgotPassword(
    @Body() dto: AdminForgotPasswordDto, // DTO containing email and new password
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
      const { email } = dto;
      // Call service method to handle password reset
      await this.adminAuthService.resetPassword(email, dto.password);

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
