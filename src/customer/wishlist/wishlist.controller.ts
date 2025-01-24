import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {
    
  }

  @Get(':userId')
  getWishlist(@Param('userId') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post(':userId/add')
  addItemToWishlist(@Param('userId') userId: string, @Body('itemId') itemId: string) {
    return this.wishlistService.addItemToWishlist(userId, itemId);
  }

  @Delete(':userId/remove/:itemId')
  removeItemFromWishlist(@Param('userId') userId: string, @Param('itemId') itemId: string) {
    return this.wishlistService.removeItemFromWishlist(userId, itemId);
  }

  @Delete(':userId/clear')
  clearWishlist(@Param('userId') userId: string) {
    return this.wishlistService.clearWishlist(userId);
  }
}
