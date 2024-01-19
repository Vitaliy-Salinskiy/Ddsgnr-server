import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

export class LoginUserDto {

	@IsNotEmpty()
	@MinLength(1)
	username: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(6)
	password: string;

}			