import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GlobalCategoryService } from './global-category.service';
import { CreateGlobalCategoryDto } from './dto/create-global-category.dto';
import { UpdateGlobalCategoryDto } from './dto/update-global-category.dto';

@Controller('global-category')
export class GlobalCategoryController {
  constructor(private readonly globalCategoryService: GlobalCategoryService) {}

  @Post()
  create(@Body() createGlobalCategoryDto: CreateGlobalCategoryDto) {
    return this.globalCategoryService.create(createGlobalCategoryDto);
  }

  @Get()
  findAll() {
    return this.globalCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.globalCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGlobalCategoryDto: UpdateGlobalCategoryDto) {
    return this.globalCategoryService.update(+id, updateGlobalCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.globalCategoryService.remove(+id);
  }
}
