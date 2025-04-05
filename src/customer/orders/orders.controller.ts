import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, GetAllOrders } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseService } from 'src/services/response/response.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly responseService: ResponseService) { }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Res() res: FastifyReply,) {
    try {

      const response = await this.ordersService.createOrder(createOrderDto);
      return res.send(
        this.responseService.sendSuccessResponse({ data: response }),
      );
    } catch (error) {
      this.responseService.handleError(res, error);
    }
  }

  @Get(':orderId')
  async getOrdersByUser(@Param('orderId') orderId: string, @Res() res: FastifyReply) {

    try {

      const response = await this.ordersService.getOrdersByUser(orderId);
      return res.send(
        this.responseService.sendSuccessResponse({ data: response }),
      );
    } catch (error) {
      this.responseService.handleError(res, error);
    }
  }

  @Post('getAllOrders')
  async getAllOrdersByUser(@Res() res: FastifyReply, @Body() getAllOrders: GetAllOrders) {
    try {
      const { mobileNo, mobileNoCountryCode } = getAllOrders
      const response = await this.ordersService.getAllOrdersByMobileNumber(mobileNoCountryCode, mobileNo);
      return res.send(
        this.responseService.sendSuccessResponse({ data: response }),
      );
    } catch (error) {
      this.responseService.handleError(res, error);
    }
  }

  @Patch(':orderId/status')
  updateOrderStatus(@Param('orderId') orderId: string, @Body('status') status: string, @Res() res: FastifyReply) {
    try {
      return this.ordersService.updateOrderStatus(orderId, status);
    } catch (error) {
      this.responseService.handleError(res, error);
    }
  }

  @Delete(':orderId')
  deleteOrder(@Param('orderId') orderId: string, @Res() res: FastifyReply) {
    try {
      return this.ordersService.deleteOrder(orderId);
    } catch (error) {
      this.responseService.handleError(res, error);
    }
  }


}
