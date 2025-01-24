import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class ItemDynamicData {
  @Prop({ required: true, ref: 'Item' })
  itemId: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true, ref: 'Unit' })
  unitId: string;
}

export type ItemDynamicDataDocument = ItemDynamicData & Document;
export const ItemDynamicDataSchema = SchemaFactory.createForClass(ItemDynamicData);

