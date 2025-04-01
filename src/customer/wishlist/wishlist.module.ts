import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { ResponseService } from 'src/services/response/response.service';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService,ResponseService],
})
export class WishlistModule {}
