import { Injectable } from '@nestjs/common';
import { CategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/schemas/category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>
) {}



  async createCategory(categoryDto: CategoryDto): Promise<Category> {
    const category = new this.categoryModel(categoryDto);
    return await category.save();
  }

  // Get Single Category by ID
  async getCategoryById(categoryId: string): Promise<Category | null> {
    return await this.categoryModel.findById(categoryId).lean();
  }

  // Get All Categories
  async getAllCategories(): Promise<Category[]> {
    return await this.categoryModel.find().lean();
  }

  // Update Category
  async updateCategory(categoryId: string, categoryDto: CategoryDto): Promise<Category | null> {
    return await this.categoryModel.findByIdAndUpdate(categoryId, categoryDto, {
      new: true,
    }).lean();
  }

  // Delete Category
  async deleteCategory(categoryId: string): Promise<void> {
    await this.categoryModel.findByIdAndDelete(categoryId);
  }
}
