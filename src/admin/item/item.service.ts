import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ResponseService } from 'src/services/response/response.service';
import { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from 'src/schemas/item.schema';
import { Model } from 'mongoose';
import { ItemDynamicData } from 'src/schemas/dynamicItemsData.schema';
import { CreateItemRequestDto, UpdateItemRequestDto } from './dto/create-item.dto';


@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
  @InjectModel(ItemDynamicData.name) private readonly dynamicDataModel: Model<ItemDynamicData>,
) {}

async createItem(createDto: CreateItemRequestDto): Promise<any> {
  const { price, stock, unitId, ...staticFields } = createDto;

  // Create static item
  const item = await new this.itemModel(staticFields).save();

  // Create dynamic data
  await new this.dynamicDataModel({
    itemId: item._id,
    price,
    stock,
    unitId,
  }).save();

  return { status: 'success', itemId: item._id };
}

async getAllItems(): Promise<any[]> {
  const items = await this.itemModel.find().lean();
  const dynamicData = await this.dynamicDataModel.find().lean();

  return items.map((item) => ({
    ...item,
    ...dynamicData.find((data) => data.itemId.toString() === item._id.toString()),
  }));
}

/**
 * Update an item's static or dynamic data
 */
async updateItem(itemId: string, updateDto: UpdateItemRequestDto): Promise<any> {
  const { price, stock, unitId, ...staticFields } = updateDto;

  // Update static fields
  if (Object.keys(staticFields).length > 0) {
    await this.itemModel.updateOne({ _id: itemId }, { $set: staticFields });
  }

  // Update dynamic fields
  const dynamicFields = { price, stock, unitId };
  if (Object.keys(dynamicFields).some((key) => dynamicFields[key] !== undefined)) {
    await this.dynamicDataModel.updateOne({ itemId }, { $set: dynamicFields });
  }

  return { status: 'success' };
}

/**
 * Retrieve item with dynamic data
 */
async getItemById(itemId: string): Promise<any> {
  console.log(itemId);

  // Fetch item and dynamic data in parallel to improve performance
  const [item, dynamicData] = await Promise.all([
    this.itemModel.findById(itemId).lean(),
    this.dynamicDataModel.findOne({ itemId }).lean(),
  ]);

  console.log(item, dynamicData);

  // Merge the results and set missing fields to `null` if not found
  return {
    itemName: item?.itemName || null,
    category: item?.category || null,
    cuisine: item?.cuisine || null,
    description: item?.description || null,
    ingredients: item?.ingredients || null,
    tags: item?.tags || null,
    fileUrl: item?.fileUrl || null,
    price: dynamicData?.price || null,
    stock: dynamicData?.stock || null,
    unitId: dynamicData?.unitId || null,
  };
}


/**
 * Delete an item and its dynamic data
 */
async deleteItem(itemId: string): Promise<any> {
  await this.itemModel.deleteOne({ _id: itemId });
  await this.dynamicDataModel.deleteOne({ itemId });
  return { status: 'success' };
}


  async uploadFile(bufferData: Buffer, fileName: string): Promise<{ fileUrl: string }> {
    try {
      // Define the public/uploads directory
      const uploadsDir = path.join(__dirname, '../../../public/uploads');
  
      // Create the directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true }); // Create parent folders if necessary
      }
  
      // Define the full file path
      const filePath = path.join(uploadsDir, fileName);
  
      // Save the file to the public/uploads directory
      await fs.promises.writeFile(filePath, bufferData);
  
      // Return the file URL relative to the public directory
      return {
        fileUrl: `/uploads/${fileName}`, // Accessible from Vercel at <domain>/uploads/<filename>
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }






  findAll() {
    return `This action returns all item`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

 

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
