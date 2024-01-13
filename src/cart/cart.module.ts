import { Module } from '@nestjs/common';

import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
	imports: [
		UsersModule,
		ProductsModule,
	],
	controllers: [CartController],
	providers: [CartService],
})
export class CartModule { }
