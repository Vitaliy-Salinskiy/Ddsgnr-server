export interface IDeleteMessage<T> {
	message: string;
	data: {
		deletedItem: T;
	};
}

export enum ProductType {
	man = "man",
	woman = "woman",
	kid = "kid"
}