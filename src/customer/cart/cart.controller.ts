import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post(':userId/add')
  addItemToCart(
    @Param('userId') userId: string,
    @Body() item: { itemId: string; quantity: number; unitId: string },
  ) {
    return this.cartService.addItemToCart(userId, item);
  }

  @Delete(':userId/remove/:itemId')
  removeItemFromCart(@Param('userId') userId: string, @Param('itemId') itemId: string) {
    return this.cartService.removeItemFromCart(userId, itemId);
  }

  @Delete(':userId/clear')
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
