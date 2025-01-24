import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';

@Module({
  imports:[
  ],
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule {}
