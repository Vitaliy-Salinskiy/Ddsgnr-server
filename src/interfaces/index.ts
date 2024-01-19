import { Types } from "mongoose";

export interface IDeleteMessage<T> {
	message: string;
	data: {
		deletedItem: T;
	};
}

export interface IPayload {
	sub: Types.ObjectId;
	username: string;
	email: string;
	image: string;
}

export enum ProductType {
	man = "man",
	woman = "woman",
	kid = "kid"
}