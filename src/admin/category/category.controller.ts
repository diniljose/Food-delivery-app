import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ResponseService } from 'src/services/response/response.service';
import { CategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly responseService: ResponseService,
    ) {}

  @Post('create')
  async createCategory(
    @Body() categoryDto: CategoryDto,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
      const category = await this.categoryService.createCategory(categoryDto);
      return res.send(
        this.responseService.sendSuccessResponse({ category }),
      );
    } catch (error) {
      return res.send(
        this.responseService.sendErrorResponse(
          'Failed to create category',
          'فشل في إنشاء الفئة',
          error.message,
        ),
      );
    }
  }

  // Get Single Category
  @Get('get/:categoryId')
  async getCategoryById(
    @Param('categoryId') categoryId: string,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
      const category = await this.categoryService.getCategoryById(categoryId);
      return res.send(
        this.responseService.sendSuccessResponse({ category }),
      );
    } catch (error) {
      return res.send(
        this.responseService.sendErrorResponse(
          'Failed to fetch category',
          'فشل في جلب الفئة',
          error.message,
        ),
      );
    }
  }

  // Get All Categories
  @Get('getAll')
  async getAllCategories(@Res() res: FastifyReply): Promise<any> {
    try {
      const categories = await this.categoryService.getAllCategories();
      return res.send(
        this.responseService.sendSuccessResponse({ categories }),
      );
    } catch (error) {
      return res.send(
        this.responseService.sendErrorResponse(
          'Failed to fetch categories',
          'فشل في جلب الفئات',
          error.message,
        ),
      );
    }
  }

  // Update Category
  @Put('update/:categoryId')
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() categoryDto: CategoryDto,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
      const updatedCategory = await this.categoryService.updateCategory(categoryId, categoryDto);
      return res.send(
        this.responseService.sendSuccessResponse({ updatedCategory }),
      );
    } catch (error) {
      return res.send(
        this.responseService.sendErrorResponse(
          'Failed to update category',
          'فشل في تحديث الفئة',
          error.message,
        ),
      );
    }
  }

  // Delete Category
  @Delete('delete/:categoryId')
  async deleteCategory(
    @Param('categoryId') categoryId: string,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
      await this.categoryService.deleteCategory(categoryId);
      return res.send(
        this.responseService.sendSuccessResponse({ message: 'Category deleted successfully' }),
      );
    } catch (error) {
      return res.send(
        this.responseService.sendErrorResponse(
          'Failed to delete category',
          'فشل في حذف الفئة',
          error.message,
        ),
      );
    }
  }
}
