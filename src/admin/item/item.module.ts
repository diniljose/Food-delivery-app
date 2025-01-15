import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ResponseService } from 'src/services/response/response.service';

@Module({
  controllers: [ItemController],
  providers: [ItemService,ResponseService],
})
export class ItemModule {}
