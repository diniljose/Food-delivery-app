import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../../schemas/cart.schema';
import { ItemDynamicData } from '../../schemas/dynamicItemsData.schema';
import { UserSignUp } from 'src/schemas/user-auth.schema';
import { ResponseService } from 'src/services/response/response.service';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Cart.name) private itemDynamicDataModel: Model<ItemDynamicData>,
    @InjectModel(UserSignUp.name) private userSignUpModel: Model<UserSignUp>,
    private readonly responseService: ResponseService
  ) { }

  async getCart(mobileNoCountryCode: string, mobileNo: number): Promise<Cart> {
    // Find the user using mobileNoCountryCode and mobileNo
    try {
      const user = await this.userSignUpModel.findOne({ mobileNoCountryCode, mobileNo });
      if (!user) {
        throw new UnauthorizedException({
          englishMessage: 'User does not exist.',
          arabicMessage: 'المستخدم غير موجود.',
        });
      }
    
      // Fetch the cart using mobileNoCountryCode and mobileNo (instead of userId)
      return this.cartModel
        .findOne({ mobileNoCountryCode, mobileNo })
        .populate('items.itemId')
        .exec();
    } catch (error) {
      this.responseService.handleErrorservice(error);
    }
  }

  async addItemToCart(
    mobileNoCountryCode: string,
    mobileNo: number,
    item: CreateCartDto,
  ): Promise<Cart> {
   try {
     console.log("hhh");
     
     // Ensure the user exists
     const user = await this.userSignUpModel.findOne({
       mobileNoCountryCode,
       mobileNo,
     }).select('mobileNo').lean().exec();
 
     console.log("user",user);
     
   
     if (!user) {
       throw new UnauthorizedException({
         englishMessage: 'User does not exist.',
         arabicMessage: 'المستخدم غير موجود.',
       });
     }
   
     console.log("sssss",user);
     
     // Fetch or create the cart using mobileNoCountryCode and mobileNo
     let cart = await this.cartModel.findOne({ mobileNoCountryCode, mobileNo });
     if (!cart) {
       cart = new this.cartModel({ mobileNoCountryCode, mobileNo, items: [] });
     }
   
     // Fetch item dynamic data based on itemId
     const itemDynamicData = await this.itemDynamicDataModel.findOne({ itemId: item.itemId });
     console.log("itemDynamicData",itemDynamicData);
     if (!itemDynamicData) {
       throw new NotFoundException('Item not found.');
     }
     
   
     // Check stock availability
     const quantity = item.quantity;
     if (itemDynamicData.isOutOfStock || parseFloat(itemDynamicData.stock.toString()) < quantity) {
       throw new NotFoundException('Item is out of stock or insufficient quantity.');
     }
   
     // Calculate the total price for the item based on the provided quantity
     const price = itemDynamicData.discountPrice || itemDynamicData.price;
     const totalPrice = price * quantity;
   
     // Find the item in the cart
     const itemIndex = cart.items.findIndex((i) => i.itemId === item.itemId);
   
     if (itemIndex === -1) {
       // Add new item to the cart
       cart.items.push({
         itemId: item.itemId,
         quantity: item.quantity, // Convert quantity to Decimal128
         unitId: item.unitId,
          price: itemDynamicData.price,
         totalPrice, // Total price for the item
         customization: item.customization, // Optional customization
       });
     } else {
       // Update the existing item in the cart
       cart.items[itemIndex].quantity = 
         (cart.items[itemIndex].quantity + quantity)
       ;
       cart.items[itemIndex].totalPrice += totalPrice;
     }
   
     // Save and return the updated cart
     return cart.save();
   } catch (error) {
    this.responseService.handleErrorservice(error);
    
   }
  }
  
  async removeItemFromCart(mobileNoCountryCode: string, mobileNo: number, itemId: string): Promise<Cart> {
    const cart = await this.cartModel.findOneAndUpdate(
      { mobileNoCountryCode, mobileNo },
      { $pull: { items: { itemId } } },
      { new: true },
    ).exec();
  
    if (!cart) {
      throw new NotFoundException(`Cart for user with mobile number ${mobileNoCountryCode}-${mobileNo} not found`);
    }
  
    return cart;
  }
  
  async clearCart(mobileNoCountryCode: string, mobileNo: number): Promise<void> {
    await this.cartModel.findOneAndUpdate({ mobileNoCountryCode, mobileNo }, { $set: { items: [] } }).exec();
  }
}

