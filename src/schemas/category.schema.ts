
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop()
  fileUrl:string
}

export const CategorySchema = SchemaFactory.createForClass(Category);
