import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class ItemDynamicData {
  @Prop({ required: true, ref: 'Item' })
  itemId: string;

  @Prop({ type: Number, required: true })
  price: number;  // Changed to string to store decimal values as strings

  @Prop({ type: Number })
  discountPrice?: number;  // Changed to string for consistency, optional field

  @Prop({ type: Number, required: true })
  stock: number;  // Changed to string to store decimal values as strings

  @Prop({ required: true, ref: 'Unit' })
  unitId: string;

  @Prop({ default: false })
  isOutOfStock: boolean; // Track whether the item is out of stock
}

export type ItemDynamicDataDocument = ItemDynamicData & Document;
export const ItemDynamicDataSchema = SchemaFactory.createForClass(ItemDynamicData);
