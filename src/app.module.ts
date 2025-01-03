import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GlobalCategoryModule } from './src/customer/global-category/global-category.module';
import { SubcategoryModule } from './src/customer/subcategory/subcategory.module';
import { ProductCategoryModule } from './src/customer/product-category/product-category.module';
import { ProductModule } from './src/customer/product/product.module';
import { UserAuthModule } from './src/customer/user-auth/user-auth.module';
import { CartModule } from './src/customer/cart/cart.module';
import { OrderModule } from './src/customer/order/order.module';
import { AnalyticsModule } from './src/admin/analytics/analytics.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
