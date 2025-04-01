import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ required: true })
  mobileNo: number;

  @Prop({ required: true })
  mobileNoCountryCode: string;

  @Prop({
    type: [
      {
        itemId: { type: String, ref: 'Item'},
        quantity: { type: Types.Decimal128}, // Changed to Decimal128
        unitId: { type: String, ref: 'Unit' },
        price: { type: Number},
        totalPrice: { type: Number},
        customization: { type: Object },
      },
    ],
    default: [],
  })
  items: {
    itemId: string;
    quantity: number; // Changed to Decimal128
    unitId: string;
    price: number;
    totalPrice: number;
    customization?: any;
  }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
