import { ProductType, Sizes } from "src/interfaces";

export class CreateProductDto {
	readonly name: string;
	readonly brand: string;
	colors: string;
	sizes: Sizes;
	readonly type: ProductType;
	readonly description?: string;
	readonly price: number;
	images?: string[];
}
