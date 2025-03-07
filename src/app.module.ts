import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsModule } from './admin/analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './customer/cart/cart.module';
import { GlobalCategoryModule } from './customer/global-category/global-category.module';
import { ProductCategoryModule } from './customer/product-category/product-category.module';
import { ProductModule } from './customer/product/product.module';
import { SubcategoryModule } from './customer/subcategory/subcategory.module';
import { UserAuthModule } from './customer/user-auth/user-auth.module';
import { UsersModule } from './users/users.module';
import { AdminAuthModule } from './admin/admin-auth/admin-auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Envconfig } from './helper/env.config';
import { AuthService } from './auth/auth.service';
import { ResponseService } from './services/response/response.service';
import { ItemModule } from './admin/item/item.module';
import { APP_ROUTES } from './constants/routes';
import { RouterModule } from '@nestjs/core';
import { UnitsModule } from './admin/units/units.module';
import { OrdersModule } from './customer/orders/orders.module';
import { WishlistModule } from './customer/wishlist/wishlist.module';
import { AppMongooseModule } from './resources/db.config';
import { CategoryModule } from './admin/category/category.module';


@Module({
  imports: [
    RouterModule.register(APP_ROUTES),
    ConfigModule.forRoot({
      envFilePath: Envconfig.local
    }),
  
    MongooseModule.forRoot(process.env.MONGODB_URI),
    GlobalCategoryModule,
    AppMongooseModule,
    SubcategoryModule,
    ProductCategoryModule,
    ProductModule,
    UserAuthModule,
    CartModule,
    AnalyticsModule,
    AuthModule,
    UsersModule,
    AdminAuthModule,
    ItemModule,
    UnitsModule,
    OrdersModule,
    WishlistModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService,ResponseService,AuthService],
})
export class AppModule {}
