import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ResponseService } from 'src/services/response/response.service';
import { CategoryDto } from './dto/create-category.dto';

@Controller()
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
      this.responseService.handleError(res, error);
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
      this.responseService.handleError(res, error);
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
      this.responseService.handleError(res, error);
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
      this.responseService.handleError(res, error);
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
      this.responseService.handleError(res, error);
    }
  }
}
