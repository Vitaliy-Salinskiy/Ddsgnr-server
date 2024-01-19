import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) { }

	@Post(":userId/:productId")
	addToCart(@Param('userId') userId: string, @Param('productId') productId: string) {
		return this.cartService.addToCart(userId, productId);
	}

	@Get(":userId")
	getCart(@Param('userId') userId: string) {
		return this.cartService.getCart(userId);
	}

	@Put(":userId/:productId")
	removeFromCart(@Param('userId') userId: string, @Param('productId') productId: string) {
		return this.cartService.removeFromCart(userId, productId);
	}

	@Delete(":userId")
	clearCart(@Param('userId') userId: string) {
		return this.cartService.clearCart(userId);
	}

}