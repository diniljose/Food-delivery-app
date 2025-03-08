import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ResponseService } from 'src/services/response/response.service';

@Module({
  controllers: [CartController],
  providers: [CartService,ResponseService],
})
export class CartModule {}
