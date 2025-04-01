import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Cart } from 'src/schemas/cart.schema';
import { ResponseService } from 'src/services/response/response.service';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService, private readonly responseService: ResponseService) { }

  // Fetch the cart for a user based on mobileNoCountryCode and mobileNo
  @Post('getCart')
  async getCart(
    @Body() body: CreateCartDto,  // Receive mobileNoCountryCode and mobileNo from the body
    @Res() res: FastifyReply,
  ) {
    try {

      const { mobileNoCountryCode, mobileNo } = body
      const response = await this.cartService.getCart(mobileNoCountryCode, mobileNo);
      return res.send(
        this.responseService.sendSuccessResponse({ data: response }),
      );
    } catch (error) {
      this.responseService.handleError(res, error);
      // handle error
    }
  }

  @Post('addItem')
  async addItemToCart(
    @Body() item: CreateCartDto,
    @Res() res: FastifyReply
  ): Promise<any> {
    const { mobileNoCountryCode, mobileNo } = item
    try {
      const response = await this.cartService.addItemToCart(mobileNoCountryCode, mobileNo, item);;
      return res.send(
        this.responseService.sendSuccessResponse({ data: response }),
      );
    } catch (error) {
      this.responseService.handleError(res, error);

    }

  }
  // Add an item to the cart

  // Remove an item from the cart
  @Delete('remove')
  async removeItemFromCart(
    @Body() { mobileNoCountryCode, mobileNo ,itemId}: CreateCartDto,  // Receive mobileNoCountryCode and mobileNo from the body
    @Res() res: FastifyReply,
  ) {
    try {
      const response = await this.cartService.removeItemFromCart(mobileNoCountryCode, mobileNo, itemId);
      return res.send(
        this.responseService.sendSuccessResponse({ data: response }),
      );
    } catch (error) {
      // handle error
      this.responseService.handleError(res, error);
    }
  }

  // Clear the cart for a user
  @Delete('clear')
  async clearCart(
    @Body() { mobileNoCountryCode, mobileNo }: CreateCartDto,  // Receive mobileNoCountryCode and mobileNo from the body
    @Res() res: FastifyReply,
  ) {
    try {
      const response = await this.cartService.clearCart(mobileNoCountryCode, mobileNo);
      return res.send(
        this.responseService.sendSuccessResponse({ data: response }),
      );
    } catch (error) {
      this.responseService.handleError(res, error);
      // handle error
    }
  }
}
