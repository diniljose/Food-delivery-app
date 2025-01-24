import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Item extends Document {
  @Prop({ required: true, unique: true, lowercase: true })
  itemName: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  cuisine: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [String], required: true })
  ingredients: string[];

  @Prop({ type: [String], required: false })
  tags?: string[];

  @Prop({ required: false })
  fileUrl?: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

