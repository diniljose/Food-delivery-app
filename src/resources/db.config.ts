import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSignUp, AdminSignUpSchema } from '../schemas/admin-auth.schema';
import { Cart, CartSchema } from '../schemas/cart.schema';
import { ItemDynamicData, ItemDynamicDataSchema } from '../schemas/dynamicItemsData.schema';
import { GlobalCategory, GlobalCategorySchema } from '../schemas/global-category.schema';
import { Item, ItemSchema } from '../schemas/item.schema';
import { Order, OrderSchema } from '../schemas/order.schema';
import { Unit, UnitSchema } from '../schemas/unit.schema';
import { UserSignUp, UserSignUpSchema } from '../schemas/user-auth.schema';
import { Wishlist, WishlistSchema } from '../schemas/wishlist.schema';
import { Category, CategorySchema } from 'src/schemas/category.schema';


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
        { name: AdminSignUp.name, schema: AdminSignUpSchema },
      ]), 
      MongooseModule.forFeature([
        { name: Category.name, schema: CategorySchema },
      ]), 
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
    ]),
    MongooseModule.forFeature([
        { name: ItemDynamicData.name, schema: ItemDynamicDataSchema },
      ]),
      MongooseModule.forFeature([
        { name: GlobalCategory.name, schema: GlobalCategorySchema },
      ]),
      MongooseModule.forFeature([
        { name: Item.name, schema: ItemSchema },
      ]),
      MongooseModule.forFeature([
        { name: Order.name, schema: OrderSchema },
      ]),
      MongooseModule.forFeature([
        { name: Unit.name, schema: UnitSchema },
      ]),
      MongooseModule.forFeature([
        { name: Wishlist.name, schema: WishlistSchema },
      ]),
    MongooseModule.forFeature([
      { name: UserSignUp.name, schema: UserSignUpSchema },
    ])
  ],
  exports: [MongooseModule],
})
export class AppMongooseModule {}
