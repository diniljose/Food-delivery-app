import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ResponseService } from 'src/services/response/response.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService,ResponseService],
})
export class CategoryModule {}
