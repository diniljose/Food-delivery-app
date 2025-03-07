import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from '../../schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async getCart(userId: string): Promise<Cart> {
    return this.cartModel.findOne({ userId }).populate('items.itemId').exec();
  }

  async addItemToCart(
    userId: string,
    item: { itemId: string; quantity: number; unitId: string },
  ): Promise<Cart> {
    // Fetch the cart first
    let cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      cart = new this.cartModel({ userId, items: [] });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex((i) => i.itemId === item.itemId);

    if (itemIndex === -1) {
      // If item doesn't exist, push it
      cart.items.push(item);
    } else {
      // If item exists, increment the quantity
      cart.items[itemIndex].quantity += item.quantity;
    }

    await cart.save();
    return cart;
  }

  async removeItemFromCart(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.cartModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { itemId } } },
      { new: true },
    ).exec();

    if (!cart) {
      throw new NotFoundException(`Cart for user ${userId} not found`);
    }

    return cart;
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartModel.findOneAndUpdate({ userId }, { $set: { items: [] } }).exec();
  }
}

