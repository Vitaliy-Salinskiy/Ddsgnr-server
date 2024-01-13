import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IPayload } from 'src/interfaces';

import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(private userService: UsersService, private jwtService: JwtService) { }

	async validateUser(username: string, password: string): Promise<UserDocument | null> {
		const user = await this.userService.findOneByProperties(username);

		if (user) {
			const isPasswordsMatch = await bcrypt.compare(password, user.password);

			if (!isPasswordsMatch) {
				return null;
			}

			return user;
		}

		return null;
	}

	async login(user: UserDocument): Promise<{ access_token: string }> {
		const payload: IPayload = { username: user.username, email: user.email, sub: user._id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

}
