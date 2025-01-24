import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: [
      {
        itemId: { type: String, ref: 'Item', required: true },
        quantity: { type: Number, required: true },
        unitId: { type: String, ref: 'Unit', required: true },
      },
    ],
    default: [],
  })
  items: {
    itemId: string;
    quantity: number;
    unitId: string;
  }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
