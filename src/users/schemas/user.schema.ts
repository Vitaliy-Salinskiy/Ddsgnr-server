import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"
import { Product } from "src/products/schemas/product.schema";

export type UserDocument = HydratedDocument<User>;

@Schema()
class ProductInCart {
	@Prop({ type: Types.ObjectId, ref: Product.name, unique: true, required: true })
	productId: string;

	@Prop({ type: Number, required: true, default: 1 })
	quantity: number;
}

@Schema()
export class User {

	readonly _id: Types.ObjectId;

	@Prop({ type: String, required: true, unique: true, trim: true })
	username: string;

	@Prop({ type: String, required: true, trim: true })
	password: string;

	@Prop({ type: String, required: true, unique: true, trim: true })
	email: string;

	@Prop({ type: String })
	image: string;

	@Prop({ type: Date, default: Date.now })
	createdAt: Date;

	@Prop({
		type: [ProductInCart],
		default: []
	})
	cart: ProductInCart[]

}

export const UserSchema = SchemaFactory.createForClass(User)