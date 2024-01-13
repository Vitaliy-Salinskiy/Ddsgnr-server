import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"
import { Product } from "src/products/schemas/product.schema";

export type UserDocument = HydratedDocument<User>;

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

	@Prop({ type: [{ type: Types.ObjectId, ref: Product.name }], default: [] })
	cart: Types.ObjectId[]

}

export const UserSchema = SchemaFactory.createForClass(User)