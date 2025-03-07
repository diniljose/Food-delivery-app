import { Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Unit } from '../../schemas/unit.schema';
import { Model } from 'mongoose';

@Injectable()
export class UnitsService {
  constructor(@InjectModel(Unit.name) private unitModel: Model<Unit>) {}

  async createOrUpdateUnits(units: CreateUnitDto[]): Promise<any> {
    const results = [];
    for (const unit of units) {
      const existingUnit = await this.unitModel.findOne({ name: unit.name.toLowerCase() });
      if (existingUnit) {
        await this.unitModel.updateOne({ _id: existingUnit._id }, unit);
        results.push({ unitId: existingUnit._id, status: 'updated' });
      } else {
        const newUnit = new this.unitModel({ ...unit, name: unit.name.toLowerCase() });
        const savedUnit = await newUnit.save();
        results.push({ unitId: savedUnit._id, status: 'created' });
      }
    }
    return results;
  }

  async getAllUnits(): Promise<Unit[]> {
    return this.unitModel.find();
  }

  async deleteUnit(unitId: string): Promise<any> {
    return this.unitModel.deleteOne({ _id: unitId });
  }
}
