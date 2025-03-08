import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Wishlist extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({
    type: [{
      itemId: { type: String, ref: 'Item' },
      // restaurantId: { type: String, ref: 'Restaurant', required: true },
      notes: { type: String }
    }],
    default: [],
  })
  items: {
    itemId: string;
    // restaurantId: string;
    notes?: string;
  }[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

