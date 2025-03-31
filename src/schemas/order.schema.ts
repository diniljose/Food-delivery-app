import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({
    type: [{
      itemId: { type: String, ref: 'Item' },
      quantity: { type: Number, required: true },
      unitId: { type: MongooseSchema.Types.ObjectId, ref: 'Unit' },
      price: { type: Number, required: true }, // Stored as string in DTO, converted to number in service
      totalPrice: { type: Number, required: true },
    }],
    required: true,
  })
  items: {
    itemId: string;
    quantity: number;
    unitId: string;
    price: number;  // Price stored as string
    totalPrice: number;
  }[];

  @Prop({ required: true })
  totalAmount: number;  // Total amount calculated in service

  @Prop({ default: 0 })
  discount: number;  // Discount applied to the order (if any)

  @Prop({ required: true })
  taxAmount: number;  // Tax calculated based on items

  @Prop({ required: true })
  grandTotal: number;  // Grand total after applying discount and tax


  @Prop({ required: true })
  shippingAddress: string;  // Shipping address for the order

  @Prop({ required: true })
  paymentMethod: string;  // Payment method used (e.g., Credit Card, PayPal)

  @Prop()
  customerNote?: string;  // Optional field for delivery instructions

  @Prop()
  estimatedDeliveryTime?: Date;  // Optional field for delivery ETA

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  deliveryAgentId?: string;  // Initially null until assigned

  @Prop({ default: 'Pending' })
  status: string; // ('Pending', 'Accepted', 'Out for Delivery', 'Delivered')
}

export const OrderSchema = SchemaFactory.createForClass(Order);
