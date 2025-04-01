import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Wishlist extends Document {
  @Prop({ required: true })
  mobileNo: number;

  @Prop({ required: true })
  mobileNoCountryCode: string;

  @Prop({
    type: [
      {
        itemId: { type: String, required: true }, // ✅ Manual string, not ObjectId
        quantity: { type: Types.Decimal128, default: 1 }, // ✅ Default quantity
        unitId: { type: String, ref: 'Unit' },
        price: { type: Number, default: 0 },
        totalPrice: { type: Number, default: 0 },
        customization: { type: Object },
      },
    ],
    default: [],
  })
  items: {
    itemId: string;
    quantity: number;
    unitId: string;
    price: number;
    totalPrice: number;
    customization?: any;
  }[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
