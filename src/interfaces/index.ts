import { Types } from "mongoose";

export interface IDeleteMessage<T> {
	message: string;
	data: {
		deletedItem: T;
	};
}

export interface ProductInCart {
	productId: string;
	quantity: number;
}

export interface IPayload {
	sub: Types.ObjectId;
	username: string;
	email: string;
	image: string;
	cart: ProductInCart[]
}

export enum ProductType {
	man = "man",
	woman = "woman",
	kid = "kid"
}

export enum Sizes {
	XS = 'XS',
	S = 'S',
	M = 'M',
	L = 'L',
	XL = 'XL',
	XXL = 'XXL'
}