import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersGateway } from './orders.gateway';
import { ResponseService } from 'src/services/response/response.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService,OrdersGateway,ResponseService],
})
export class OrdersModule {}
