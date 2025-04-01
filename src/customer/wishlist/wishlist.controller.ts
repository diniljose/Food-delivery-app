import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { ResponseService } from 'src/services/response/response.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateWishListDto } from './dto/wishlist.dto';

@Controller()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService, private readonly responseService: ResponseService) {

  }

  @Get(':mobileNoCountryCode/:mobileNo')
  async getWishlist(@Param('mobileNoCountryCode') mobileNoCountryCode: string, @Param('mobileNo') mobileNo: number, @Res() res: FastifyReply,) {
    try {
      const response = await this.wishlistService.getWishlist(mobileNoCountryCode, mobileNo)
      return res.send(
        this.responseService.sendSuccessResponse({ data: response }),
      );

    } catch (error) {
      this.responseService.handleError(res, error);
    }
  }

  @Post('addItemWishlist')
  async addItemToWishlist(@Body() body: CreateWishListDto, @Res() res: FastifyReply,) {
    try {
      const { mobileNoCountryCode, mobileNo, itemId } = body
      const response = await this.wishlistService.addItemToWishlist(mobileNoCountryCode, mobileNo, itemId);
      return res.send(
        this.responseService.sendSuccessResponse({ data: response }),
      );
    } catch (error) {
      this.responseService.handleError(res, error);
    }
  }

  @Delete('remove')
  async removeItemFromWishlist(@Body() { mobileNoCountryCode, mobileNo ,itemId}: CreateWishListDto, @Res() res: FastifyReply,) {
    try {
      const response = await this.wishlistService.removeItemFromWishlist(mobileNoCountryCode, mobileNo, itemId);
      return res.send(
        this.responseService.sendSuccessResponse({ data: response }),
      );
    } catch (error) {
      this.responseService.handleError(res, error);
    }
  }

  @Delete('clear')
  async clearWishlist(@Body() { mobileNoCountryCode, mobileNo }: CreateWishListDto, @Res() res: FastifyReply,) {
    try {
      const response = await this.wishlistService.clearWishlist(mobileNoCountryCode, mobileNo);
      return res.send(
        this.responseService.sendSuccessResponse({ data: response }),
      );
    } catch (error) {
      this.responseService.handleError(res, error);
    }
  }
}
