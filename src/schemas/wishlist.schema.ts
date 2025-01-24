import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Wishlist extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({
    type: [{ type: String, ref: 'Item' }],
    default: [],
  })
  items: string[]; // Array of item IDs
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
