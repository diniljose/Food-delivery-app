import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalCategory, GlobalCategorySchema } from 'src/schemas/global-category.schema';


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GlobalCategory.name, schema: GlobalCategorySchema },
    ])

  ],
  exports: [MongooseModule],
})
export class AppMongooseModule {}
