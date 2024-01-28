import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';

import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) { }

	@UseGuards(JwtAuthGuard)
	@Post(":productId")
	addToCart(@Request() req: ExpressRequest, @Param('productId') productId: string, @Query('quantity') quantity?: number) {
		if (!req.user || !req.user['userId']) {
			throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
		}

		const userId = req.user['userId'];
		return this.cartService.addToCart(userId, productId, quantity);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	getCart(@Request() req: ExpressRequest) {
		if (!req.user || !req.user['userId']) {
			throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
		}

		const userId = req.user['userId'];
		return this.cartService.getCart(userId);
	}

	@UseGuards(JwtAuthGuard)
	@Put(":productId")
	removeFromCart(@Request() req: ExpressRequest, @Param('productId') productId: string) {
		if (!req.user || !req.user['userId']) {
			throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
		}

		const userId = req.user['userId'];
		return this.cartService.removeFromCart(userId, productId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete()
	clearCart(@Request() req: ExpressRequest) {
		if (!req.user || !req.user['userId']) {
			throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
		}

		const userId = req.user['userId'];
		return this.cartService.clearCart(userId);
	}

}
