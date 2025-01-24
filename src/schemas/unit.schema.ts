import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Unit extends Document {
  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop({ required: false })
  abbreviation?: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
