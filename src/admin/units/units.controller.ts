import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit } from 'src/schemas/unit.schema';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ResponseService } from 'src/services/response/response.service';

@Controller()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService,    private readonly responseService: ResponseService,) {}

  @Post('create')
  async createOrUpdateUnits(@Res() res: FastifyReply, @Body() units: CreateUnitDto[]): Promise<any> {
   try {
     const response = await  this.unitsService.createOrUpdateUnits(units);
      return res.send(
        this.responseService.sendSuccessResponse({ data: response}),
      );
   } catch (error) {
    this.responseService.handleError(res, error);
   }
  }

  @Get()
  async getUnits(@Res() res: FastifyReply): Promise<Unit[]> {
  try {
      const response = await this.unitsService.getAllUnits();
      return res.send(
        this.responseService.sendSuccessResponse({ data: response}),
      );
  } catch (error) {
    this.responseService.handleError(res, error);
  }
  }

  @Get('getAll')
  async getAllItems(@Res() res: FastifyReply): Promise<any> {
    try {
      const response =  await this.unitsService.getAllUnits();
      return res.send(
        this.responseService.sendSuccessResponse({ data: response}),
      );
    } catch (error) {
      this.responseService.handleError(res, error);

    }
  }

  @Delete(':id')
  async deleteUnit(@Res() res: FastifyReply, @Param('id') id: string): Promise<any> {
   try {
    const response =  this.unitsService.deleteUnit(id);
    return res.send(
      this.responseService.sendSuccessResponse({ data: response}),
    );
   
   } catch (error) {
    this.responseService.handleError(res, error);
    
   }
  }
}
