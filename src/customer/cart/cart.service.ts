import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Cart } from '../../schemas/cart.schema';
import { ItemDynamicData } from '../../schemas/dynamicItemsData.schema';
import { UserSignUp } from '../../schemas/user-auth.schema';
import { ResponseService } from 'src/services/response/response.service';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(ItemDynamicData.name) private itemDynamicDataModel: Model<ItemDynamicData>,
    @InjectModel(UserSignUp.name) private userSignUpModel: Model<UserSignUp>,
    private readonly responseService: ResponseService
  ) { }

  async getCart(mobileNoCountryCode: string, mobileNo: number): Promise<Cart> {
    try {
      const user = await this.userSignUpModel.findOne({ mobileNoCountryCode, mobileNo }).lean();
      if (!user) {
        throw new UnauthorizedException({
          englishMessage: 'User does not exist.',
          arabicMessage: 'المستخدم غير موجود.',
        });
      }
  
      // Fetch cart
      const cart = await this.cartModel.findOne({ mobileNoCountryCode, mobileNo }).lean();
      if (!cart || !cart.items.length) return cart;
  
      // Filter and convert only valid ObjectIds
      const itemIds = cart.items
        .map(item => item.itemId)
        .filter(id => mongoose.Types.ObjectId.isValid(id)) // Ensure it's a valid ObjectId
        .map(id => new mongoose.Types.ObjectId(id)); // Convert to ObjectId
  
      // Fetch all items in a single query
      const itemsMap = new Map(
        (await this.itemDynamicDataModel.find({ _id: { $in: itemIds } }).lean()).map(item => [item._id.toString(), item])
      );
  
      // Attach item details manually
      cart.items = cart.items.map(item => ({
        ...item,
        itemDetails: itemsMap.get(item.itemId) || null, // Attach item details or null if not found
      }));
  
      return cart;
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

      // Ensure the user exists
      const user = await this.userSignUpModel.findOne({
        mobileNoCountryCode,
        mobileNo,
      }).select('mobileNo').lean().exec();

      console.log("user", item.itemId);

      if (!user) {
        throw new UnauthorizedException({
          englishMessage: 'User does not exist.',
          arabicMessage: 'المستخدم غير موجود.',
        });
      }

      // Fetch or create the cart using mobileNoCountryCode and mobileNo
      let cart = await this.cartModel.findOne({ mobileNoCountryCode, mobileNo });
      if (!cart) {
        cart = new this.cartModel({ mobileNoCountryCode, mobileNo, items: [] });
      }

      // Fetch item dynamic data based on itemId
      const itemDynamicData = await this.itemDynamicDataModel.findOne({ itemId: item.itemId });
      console.log("itemDynamicData", itemDynamicData);
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
      console.log("error", error);

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

