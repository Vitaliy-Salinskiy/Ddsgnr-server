import { UserDocument } from "src/users/schemas/user.schema";

export interface IDeleteUserMessage {
	message: string;
	data: {
		user: UserDocument;
	};
}