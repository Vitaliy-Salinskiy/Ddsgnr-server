import { ProductType } from "src/interfaces";

export class CreateProductDto {
	readonly name: string;
	readonly brand: string;
	price: number;
	image?: string;
	readonly type: ProductType;
}
