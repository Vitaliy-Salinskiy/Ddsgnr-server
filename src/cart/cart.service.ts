import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ProductsService } from 'src/products/products.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CartService {

	constructor(private userService: UsersService, private productService: ProductsService) { }

	async addToCart(userId: string, productId: string, quantity: number = 1) {
		try {
			const user: UserDocument = await this.userService.findOne(userId)
			const product = await this.productService.findOne(productId)

			if (!user || !product) {
				throw new HttpException("User or product not found", HttpStatus.NOT_FOUND)
			}

			const quantityNumber = Number(quantity);

			if (isNaN(quantityNumber) || quantityNumber < 1 || quantityNumber > 99) {
				throw new HttpException("Invalid quantity", HttpStatus.BAD_REQUEST)
			}

			const cartItem = user.cart.find(p => p.productId.toString() === product._id.toString());

			if (cartItem) {
				cartItem.quantity = quantity;
			} else {
				user.cart.push({ productId: product._id.toString(), quantity });
			}

			await user.save();

			return user
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
		}

	}

	async getCart(userId: string) {
		try {
			const user: UserDocument = await this.userService.findOne(userId)

			if (!user) {
				throw new HttpException("User not found", HttpStatus.NOT_FOUND)
			}

			return user.cart
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	async removeFromCart(userId: string, productId: string) {
		try {
			const user: UserDocument = await this.userService.findOne(userId)
			const product = await this.productService.findOne(productId)

			if (!user || !product) {
				throw new HttpException("User or product not found", HttpStatus.NOT_FOUND)
			}

			user.cart = user.cart.filter(p => p.productId.toString() !== product._id.toString());
			await user.save();

			return user;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	async clearCart(userId: string) {
		try {
			const user: UserDocument = await this.userService.findOne(userId)

			if (!user) {
				throw new HttpException("User not found", HttpStatus.NOT_FOUND)
			}

			user.cart = [];
			await user.save();

			return user;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

}