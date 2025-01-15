import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Items extends Document {
  @Prop({ required: true, unique: true })
  itemName: string;

  @Prop({ required: true })
  category: string; // e.g., seafood, chicken, vegetarian

  @Prop({ required: true })
  cuisine: string; // e.g., Italian, Indian, Chinese

  @Prop({ required: true, min: 0 })
  price: number; // Price of the item

  @Prop({ required: true, min: 1 })
  quantity: number; // Available quantity of the item

  @Prop()
  description?: string; // Optional description of the item

  @Prop({ type: [String], required: true })
  ingredients: string[]; // List of ingredients used

  @Prop({ type: [String] })
  tags?: string[]; // Optional tags like "Spicy", "Gluten-Free", etc.


  @Prop({ default: true })
  isAvailable: boolean; // Availability status of the item

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Items);
