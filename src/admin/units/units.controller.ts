import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit } from 'src/schemas/unit.schema';
import { ResponseService } from 'src/services/response/response.service';
import { FastifyReply, FastifyRequest } from 'fastify';


@Controller()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService,    private readonly responseService: ResponseService,) {}

  @Post('create')
  async createOrUpdateUnits(@Body() units: CreateUnitDto[]): Promise<any> {
    return this.unitsService.createOrUpdateUnits(units);
  }

 
  

  @Get('getAll')
  async getAllItems(@Res() res: FastifyReply): Promise<any> {
    try {
      const response =  this.unitsService.getAllUnits();
      return res.send(
        this.responseService.sendSuccessResponse({ data: response}),
      );
    } catch (error) {
      return res.send(
        this.responseService.sendErrorResponse(
          'Failed to fetch items',
          'فشل في جلب العناصر',
          error.message,
        ),
      );
    }
  }

  @Delete(':id')
  async deleteUnit(@Param('id') id: string): Promise<any> {
    return this.unitsService.deleteUnit(id);
  }
}
