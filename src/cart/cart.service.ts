import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ProductsService } from 'src/products/products.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CartService {

	constructor(private userService: UsersService, private productService: ProductsService) { }

	async addToCart(userId: string, productId: string) {
		const user: UserDocument = await this.userService.findOne(userId)
		const product = await this.productService.findOne(productId)

		if (!user || !product) {
			throw new HttpException("User or product not found", HttpStatus.NOT_FOUND)
		}

		user.cart.push(product._id);
		await user.save();

		return user
	}

	async getCart(userId: string) {
		const user: UserDocument = await this.userService.findOne(userId)

		if (!user) {
			throw new HttpException("User not found", HttpStatus.NOT_FOUND)
		}

		return user.cart
	}

	async removeFromCart(userId: string, productId: string) {
		const user: UserDocument = await this.userService.findOne(userId)
		const product = await this.productService.findOne(productId)

		if (!user || !product) {
			throw new HttpException("User or product not found", HttpStatus.NOT_FOUND)
		}

		user.cart = user.cart.filter(p => p.toString() !== product._id.toString());
		await user.save();

		return user;
	}

	async clearCart(userId: string) {
		const user: UserDocument = await this.userService.findOne(userId)

		if (!user) {
			throw new HttpException("User not found", HttpStatus.NOT_FOUND)
		}

		user.cart = [];
		await user.save();

		return user;
	}

}