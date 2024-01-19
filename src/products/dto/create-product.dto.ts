import { ProductType } from "src/interfaces";

export class CreateProductDto {
	readonly name: string;
	readonly brand: string;
	price: number;
	images?: string[];
	readonly type: ProductType;
}
