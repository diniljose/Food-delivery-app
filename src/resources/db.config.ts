import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSignUp, AdminSignUpSchema } from 'src/schemas/admin-auth.schema';
import { GlobalCategory, GlobalCategorySchema } from 'src/schemas/global-category.schema';
import { UserSignUp, UserSignUpSchema } from 'src/schemas/user-auth.schema';


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GlobalCategory.name, schema: GlobalCategorySchema },
    ]),
    MongooseModule.forFeature([
      { name: UserSignUp.name, schema: UserSignUpSchema },
    ])
    ,
    MongooseModule.forFeature([
      { name: AdminSignUp.name, schema: AdminSignUpSchema },
    ])

  ],
  exports: [MongooseModule],
})
export class AppMongooseModule {}
