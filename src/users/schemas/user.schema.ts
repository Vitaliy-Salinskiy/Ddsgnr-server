import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

	readonly _id: string;

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

}

export const UserSchema = SchemaFactory.createForClass(User)