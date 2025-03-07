import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ResponseService } from 'src/services/response/response.service';
import { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from '../../schemas/item.schema';
import { Model } from 'mongoose';
import { ItemDynamicData } from '../../schemas/dynamicItemsData.schema';
import { CreateItemRequestDto, UpdateItemRequestDto } from './dto/create-item.dto';
import { Category } from '../../schemas/category.schema';


@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
  @InjectModel(ItemDynamicData.name) private readonly dynamicDataModel: Model<ItemDynamicData>,
  @InjectModel(Category.name) private categoryModel: Model<Category>
) {}

async createItem(createDto: CreateItemRequestDto): Promise<any> {
  const { price, stock, unitId, itemName, categoryId, ...staticFields } = createDto;

  // Validate if categoryId exists in the Category collection
  const categoryExists = await this.categoryModel.findById(categoryId).select('name').lean().exec();
  if (!categoryExists) {
    throw new BadRequestException({
      englishMessage: 'Invalid categoryId: Category does not exist',
      arabicMessage: 'معرف الفئة غير صالح: الفئة غير موجودة.',
    });

  }

  // Generate a user-friendly unique ID (e.g., "pizza-12345")
  const sanitizedItemName = itemName.toLowerCase().replace(/\s+/g, '-').substring(0, 6); // Take first 6 characters
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit random number
  const itemId = `${sanitizedItemName}-${randomNumber}`;

  // Create static item with categoryId and other fields
  const item = await new this.itemModel({
    itemId,
    itemName,
    categoryId,  // Reference to the Category model
    ...staticFields,
  }).save();

  // Create dynamic data (price, stock, and unitId) associated with the item
  await new this.dynamicDataModel({
    itemId: item.itemId,
    price,
    stock,
    unitId,
  }).save();

  // Return success response with the created item's ID
  return { status: 'success', itemId: item.itemId };
}




async getAllItems(): Promise<any[]> {
  const items = await this.itemModel
    .find()
    .populate('categoryId', 'name description') // Populating the categoryId field with the category name and description
    .lean();
  const dynamicData = await this.dynamicDataModel.find().lean();

  return items.map((item) => ({
    ...item,
    category: item.categoryId,  // Now category is populated directly
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
    await this.itemModel.updateOne({ itemId }, { $set: staticFields });
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
  // Fetch item and dynamicData in parallel for better performance
  const [item, dynamicData] = await Promise.all([
    this.itemModel
      .findOne({ itemId })
      .populate('categoryId', 'name description') // Populating the categoryId field
      .lean(),
    this.dynamicDataModel.findOne({ itemId }).lean(),
  ]);

  // Merge results, setting missing fields to null
  const result = {
    ...(item || { name: null, description: null, category: null, price: null, stock: null }),
    ...(dynamicData || { price: null, stock: null, unitId: null }),
  };

  // If both are null, throw an exception
  if (!item && !dynamicData) {
    throw new NotFoundException('Item not found in either table.');
  }

  return result;
}



/**
 * Delete an item and its dynamic data
 */
async deleteItem(itemId: string): Promise<any> {
  await this.itemModel.deleteOne({ itemId });
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
