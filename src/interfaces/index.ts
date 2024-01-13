export interface IDeleteMessage<T> {
	message: string;
	data: {
		deletedItem: T;
	};
}

export interface IPayload {
	sub: string;
	username: string;
	email: string;
}

export enum ProductType {
	man = "man",
	woman = "woman",
	kid = "kid"
}