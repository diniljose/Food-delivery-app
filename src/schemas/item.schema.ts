import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category } from './category.schema'; // Import Category schema

@Schema({ timestamps: true })
export class Item extends Document {
  @Prop({ unique: true })
  itemId: string;

  @Prop({ required: true, lowercase: true })
  itemName: string;

  @Prop({ type: String, required: true, ref: 'Category' })
  categoryId: string;

  @Prop({ type: String, required: true, ref: 'Restaurant' })
  restaurantId: string; // New field to associate items with restaurants

  @Prop({ required: true })
  cuisine: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], required: true })
  ingredients: string[];

  @Prop({ type: [String] })
  tags?: string[];

  @Prop()
  fileUrl?: string;

  @Prop()
  imageUrls: string[];

  @Prop({ default: true })
  isAvailable: boolean; // New field to track availability

  @Prop({ type: Number, default: 0 })
  rating: number; // New field to store average rating
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
