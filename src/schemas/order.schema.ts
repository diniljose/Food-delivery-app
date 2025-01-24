import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ type: [{ 
    itemId: { type: MongooseSchema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number, required: true },
    unitId: { type: MongooseSchema.Types.ObjectId, ref: 'Unit' },
    price: { type: Number, required: true },
  }], required: true })
  items: {
    itemId: string;
    quantity: number;
    unitId: string;
    price: number;
  }[];

  @Prop({ required: true })
  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  shippingAddress: string;

  @Prop({ required: true })
  paymentMethod: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
