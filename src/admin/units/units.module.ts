import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { ResponseService } from 'src/services/response/response.service';

@Module({
  imports:[
  ],
  controllers: [UnitsController],
  providers: [UnitsService,ResponseService],
})
export class UnitsModule {}
