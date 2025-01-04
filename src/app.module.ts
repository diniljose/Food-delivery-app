import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsModule } from './admin/analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './customer/cart/cart.module';
import { GlobalCategoryModule } from './customer/global-category/global-category.module';
import { OrderModule } from './customer/order/order.module';
import { ProductCategoryModule } from './customer/product-category/product-category.module';
import { ProductModule } from './customer/product/product.module';
import { SubcategoryModule } from './customer/subcategory/subcategory.module';
import { UserAuthModule } from './customer/user-auth/user-auth.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GlobalCategoryModule,
    SubcategoryModule,
    ProductCategoryModule,
    ProductModule,
    UserAuthModule,
    CartModule,
    OrderModule,
    AnalyticsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
