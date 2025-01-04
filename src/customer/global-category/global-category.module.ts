import { Module } from '@nestjs/common';
import { GlobalCategoryService } from './global-category.service';
import { GlobalCategoryController } from './global-category.controller';

@Module({
  controllers: [GlobalCategoryController],
  providers: [GlobalCategoryService],
})
export class GlobalCategoryModule {}
