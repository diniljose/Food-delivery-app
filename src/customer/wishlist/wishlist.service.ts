import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Wishlist } from '../../schemas/wishlist.schema';
import { ResponseService } from 'src/services/response/response.service';
import { UserSignUp } from 'src/schemas/user-auth.schema';
import { Item } from 'src/schemas/item.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>, 
  private readonly responseService: ResponseService,
  @InjectModel(UserSignUp.name) private userSignUpModel: Model<UserSignUp>,
  @InjectModel(Item.name) private itemModel: Model<Item>,
  ) { }

  async getWishlist(mobileNoCountryCode: string, mobileNo: number): Promise<Wishlist> {
    try {
      const wishlist = await this.wishlistModel.findOne({ mobileNoCountryCode, mobileNo }).populate('items').exec();
      if (!wishlist) {
        throw new NotFoundException('Wishlist not found');
      }
      return wishlist;
    } catch (error) {
      this.responseService.handleErrorservice(error);
    }
  }

  async addItemToWishlist(mobileNoCountryCode: string, mobileNo: number, itemId: string): Promise<{ success: boolean }> {
    try {
   
      const userExists = await this.userSignUpModel.exists({ mobileNoCountryCode, mobileNo });
      if (!userExists) {
        throw new UnauthorizedException({
          englishMessage: "User does not exist.",
          arabicMessage: "المستخدم غير موجود.",
        });
      }
  
     
      const itemExists = await this.itemModel.exists({ itemId });
      if (!itemExists) {
        throw new NotFoundException({
          englishMessage: "Item not found.",
          arabicMessage: "العنصر غير موجود.",
        });
      }
  
      
      await this.wishlistModel.findOneAndUpdate(
        { mobileNoCountryCode, mobileNo },
        { $addToSet: { items: { itemId } } }, // 🔹 Ensure proper structure
        { upsert: true, new: true }
      );
  
      return { success: true };
    } catch (error) {
      console.error(error);
      this.responseService.handleErrorservice(error);
      return { success: false };
    }
  }
  
  
  
  async removeItemFromWishlist(mobileNoCountryCode: string, mobileNo: number, itemId: string): Promise<Wishlist> {
    try {
      const wishlist = await this.wishlistModel.findOneAndUpdate(
        { mobileNoCountryCode, mobileNo },
        { $pull: { items: { itemId } } }, // 🔹 Correct way to remove based on `itemId`
        { new: true }
      ).exec();
  
      console.log(wishlist);
  
      if (!wishlist) {
        throw new NotFoundException(`Wishlist for user ${mobileNo} not found`);
      }
      
      return wishlist;
    } catch (error) {
      this.responseService.handleErrorservice(error);
    }
  }
  
  async clearWishlist(mobileNoCountryCode:string, mobileNo:number): Promise<void> {
    try {
      await this.wishlistModel.findOneAndUpdate({ mobileNoCountryCode,mobileNo }, { $set: { items: [] } }).exec();
    } catch (error) {
      this.responseService.handleErrorservice(error);
    }
  }
}
