import { Controller, Get, Post, Body, Patch, Param, Delete,Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseService } from 'src/services/response/response.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService,private readonly responseService: ResponseService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto,@Res() res: FastifyReply,) {
   try {
     return this.ordersService.createOrder(createOrderDto);
   } catch (error) {
    this.responseService.handleError(res, error);
   }
  }

  @Get(':orderId')
  getOrdersByUser(@Param('orderId') orderId: string,@Res() res: FastifyReply) {
 
   try {
     return res.send(
       this.ordersService.getOrdersByUser(orderId),
     );
   } catch (error) {
    this.responseService.handleError(res, error);
   }
  }

  @Get('getAllOrders')
  getAllOrdersByUser(@Res() res: FastifyReply) {
    try {
      return this.ordersService.getAllOrdersByUser();
    } catch (error) {
      this.responseService.handleError(res, error);
    }
  }

  @Patch(':orderId/status')
  updateOrderStatus(@Param('orderId') orderId: string, @Body('status') status: string,@Res() res: FastifyReply) {
    try {
      return this.ordersService.updateOrderStatus(orderId, status);
    } catch (error) {
      this.responseService.handleError(res, error);
    }
  }

  @Delete(':orderId')
  deleteOrder(@Param('orderId') orderId: string,@Res() res: FastifyReply) {
   try {
     return this.ordersService.deleteOrder(orderId);
   } catch (error) {
    this.responseService.handleError(res, error);
   }
  }


}
