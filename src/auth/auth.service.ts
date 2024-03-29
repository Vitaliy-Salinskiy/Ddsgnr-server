import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IPayload } from 'src/interfaces';
import { MailService } from 'src/mail/mail.service';
import { OtpService } from 'src/otp/otp.service';

import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(private userService: UsersService, private jwtService: JwtService, private otpService: OtpService, private mailService: MailService) { }

	async validateUser(username: string, password: string): Promise<UserDocument | null> {
		try {
			const user = await this.userService.findOneByProperties(username);

			if (user) {
				const isPasswordsMatch = await bcrypt.compare(password, user.password);

				if (!isPasswordsMatch) {
					return null;
				}

				return user;
			}

			return null;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async login(user: UserDocument): Promise<{ access_token: string }> {
		try {
			let image = null;
			if (user.image) {
				image = user.image;
			}
			const payload: IPayload = { username: user.username, email: user.email, sub: user._id, image, cart: user.cart };
			return {
				access_token: this.jwtService.sign(payload),
			};
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async sendOtp(email: string): Promise<{ message: string, otpToken: string }> {
		try {
			const user = await this.userService.findOneByEmail(email);
			if (!user) {
				throw new HttpException(`User with this email: ${email} not found`, HttpStatus.NOT_FOUND);
			}
			const otp = await this.otpService.generateOtp();
			await this.mailService.sendOtp(email, otp)

			const otpToken: string = this.jwtService.sign({ otp: otp });

			return { message: "Otp sent successfully", otpToken };
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async validateOtp(otp: string, token: string) {
		try {
			const decoded = this.jwtService.verify(token);
			const decodedOtp = decoded.otp;

			const isValid = decodedOtp === otp;

			if (isValid) {
				return isValid;
			} else {
				throw new HttpException("Invalid OTP", HttpStatus.BAD_REQUEST);
			}
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async resetPassword(email: string, password: string) {
		try {
			const user = await this.userService.findOneByEmail(email);
			if (!user) {
				throw new Error(`User with this email: ${email} not found`);
			}
			await this.userService.resetPassword(user._id.toString(), password);
			return { message: "Password reset successfully" };
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateUser(token: string, updatedData: Partial<UserDocument>) {
		try {
			const decoded: IPayload = this.jwtService.decode(token);
			const userId = decoded.sub;

			const user = await this.userService.findOne(userId.toString());
			if (!user) {
				throw new HttpException("User not found", HttpStatus.NOT_FOUND);
			}

			for (const key in updatedData) {
				user[key] = updatedData[key];
			}

			await user.save();

			const newToken = this.jwtService.sign({ userId: user._id, ...updatedData });

			return { token: newToken };
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
