import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit } from 'src/schemas/unit.schema';

@Controller()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post('create')
  async createOrUpdateUnits(@Body() units: CreateUnitDto[]): Promise<any> {
    return this.unitsService.createOrUpdateUnits(units);
  }

  @Get()
  async getUnits(): Promise<Unit[]> {
    return this.unitsService.getAllUnits();
  }

  @Delete(':id')
  async deleteUnit(@Param('id') id: string): Promise<any> {
    return this.unitsService.deleteUnit(id);
  }
}
