import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(private userService: UsersService) { }

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

}
