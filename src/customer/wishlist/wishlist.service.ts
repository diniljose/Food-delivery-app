import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist } from 'src/schemas/wishlist.schema';

@Injectable()
export class WishlistService {
    constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>) {}
  
    async getWishlist(userId: string): Promise<Wishlist> {
      const wishlist = await this.wishlistModel.findOne({ userId }).populate('items').exec();
      if (!wishlist) {
        throw new NotFoundException('Wishlist not found');
      }
      return wishlist;
    }
  
    async addItemToWishlist(userId: string, itemId: string): Promise<Wishlist> {
      // Use $addToSet to prevent duplicates
      return this.wishlistModel.findOneAndUpdate(
        { userId },
        { $addToSet: { items: itemId } },
        { new: true, upsert: true },
      ).exec();
    }
  
    async removeItemFromWishlist(userId: string, itemId: string): Promise<Wishlist> {
      const wishlist = await this.wishlistModel.findOneAndUpdate(
        { userId },
        { $pull: { items: itemId } },
        { new: true },
      ).exec();
  
      if (!wishlist) {
        throw new NotFoundException(`Wishlist for user ${userId} not found`);
      }
      return wishlist;
    }
  
    async clearWishlist(userId: string): Promise<void> {
      await this.wishlistModel.findOneAndUpdate({ userId }, { $set: { items: [] } }).exec();
    }
  }
  