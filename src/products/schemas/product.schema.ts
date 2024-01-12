import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

import { ProductType } from "src/interfaces";

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {

	_id: string;

	@Prop({ type: String, required: true, trim: true })
	name: string;

	@Prop({ type: String, required: true, trim: true })
	brand: string;

	@Prop({ type: Number, required: true })
	price: number;

	@Prop({ type: String, required: true })
	image: string;

	@Prop({ type: String, required: true, trim: true, enum: ProductType })
	type: ProductType;

}

export const ProductSchema = SchemaFactory.createForClass(Product)