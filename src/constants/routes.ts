import { AdminAuthModule } from "src/admin/admin-auth/admin-auth.module";
import { CategoryModule } from "src/admin/category/category.module";
import { ItemModule } from "src/admin/item/item.module";
import { UnitsModule } from "src/admin/units/units.module";
import { CartModule } from "src/customer/cart/cart.module";
import { OrdersModule } from "src/customer/orders/orders.module";
import { UserAuthModule } from "src/customer/user-auth/user-auth.module";
import { WishlistModule } from "src/customer/wishlist/wishlist.module";

export const APP_ROUTES = [
	{
		path: 'admin',
		module: AdminAuthModule,
	},
	{
		path: 'userAuth',
		module: UserAuthModule,
	},
	{
		path: 'item',
		module: ItemModule,
	},
	{
		path: 'category',
		module: CategoryModule,
	},
	{
		path: 'units',
		module: UnitsModule,
	},

	{
		path: 'orders',
		module: OrdersModule,
	},
	{
		path: 'cart',
		module: CartModule,
	},
	{
		path: 'wishlist',
		module: WishlistModule,
	},
	
];
