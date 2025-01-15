import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { UpdateUserAuthDto } from './dto/update-user-auth.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseService } from 'src/services/response/response.service';

@Controller()
export class UserAuthController {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly responseService: ResponseService,
    ) {}



  @Post('signUp')
  async signUpApplicant(
    @Body() dto: CreateUserAuthDto,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
      dto.email = dto.email.toLowerCase();
    
      // Pass the DTO to the service
      const signUpResponse = await this.userAuthService.signUpUser(dto);

      return res
        .status(HttpStatus.OK)
        .send(
          this.responseService.sendSuccessResponse({ data: signUpResponse }),
        );
    } catch (error) {
      return this.responseService.handleError(res, error);
    }
  }

  @Get()
  findAll() {
    return this.userAuthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAuthService.findOne(+id);
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
