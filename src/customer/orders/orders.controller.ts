import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get(':userId')
  getOrdersByUser(@Param('userId') userId: string) {
    return this.ordersService.getOrdersByUser(userId);
  }

  @Patch(':orderId/status')
  updateOrderStatus(@Param('orderId') orderId: string, @Body('status') status: string) {
    return this.ordersService.updateOrderStatus(orderId, status);
  }

  @Delete(':orderId')
  deleteOrder(@Param('orderId') orderId: string) {
    return this.ordersService.deleteOrder(orderId);
  }


}
