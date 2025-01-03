import { Injectable } from '@nestjs/common';
import { CreateGlobalCategoryDto } from './dto/create-global-category.dto';
import { UpdateGlobalCategoryDto } from './dto/update-global-category.dto';

@Injectable()
export class GlobalCategoryService {
  create(createGlobalCategoryDto: CreateGlobalCategoryDto) {
    return 'This action adds a new globalCategory';
  }

  findAll() {
    return `This action returns all globalCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} globalCategory`;
  }

  update(id: number, updateGlobalCategoryDto: UpdateGlobalCategoryDto) {
    return `This action updates a #${id} globalCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} globalCategory`;
  }
}
