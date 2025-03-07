import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category } from './category.schema'; // Import Category schema

@Schema({ timestamps: true })
export class Item extends Document {
  @Prop({ unique: true })
  itemId: string;

  @Prop({ required: true, lowercase: true })
  itemName: string;

  // Updated category to reference Category model
  @Prop({ type: String, required: true, ref: 'Category' })
  categoryId: string; // This will store the category reference (ObjectId)

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

// Automatically generate a short `itemId` before saving
ItemSchema.pre<Item>('save', function (next) {
  if (!this.itemId) {
    const shortName = this.itemName.replace(/\s+/g, '-').substring(0, 6); // Short name (max 6 chars)
    const randomNum = Math.floor(10000 + Math.random() * 90000); // Random 5-digit number
    this.itemId = `${shortName}-${randomNum}`; // Example: "pizza-45789"
  }
  next();
});
