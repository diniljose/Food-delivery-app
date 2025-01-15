import { AdminAuthModule } from "src/admin/admin-auth/admin-auth.module";
import { ItemModule } from "src/admin/item/item.module";
import { UserAuthModule } from "src/customer/user-auth/user-auth.module";

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
	
];
