import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, Req, Request, Res, UseGuards, } from '@nestjs/common';
import { Response, Request as ExpressRequest } from "express"

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserDocument } from 'src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@UseGuards(LocalAuthGuard)
	@Post("login")
	async login(@Request() req: any, @Res() res: Response) {
		try {
			const loginResult = await this.authService.login(req.user);
			if (loginResult) {
				res.cookie("ddsgnr_access_token", loginResult.access_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
				return res.json(loginResult);
			}
			return res.json(loginResult);
		} catch (error) {
			return res.json(error.message);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get("profile")
	getProfile(@Request() req: any) {
		return req.user;
	}

	@Post('otp')
	async sendOtp(@Body('email') email: string, @Res() response: Response) {
		const mailResponse = await this.authService.sendOtp(email);
		response.cookie("ddsgnr_otp", mailResponse.otpToken, { httpOnly: true, maxAge: 5 * 60 * 1000 });
		return response.send(mailResponse);
	}

	@Post('validate-otp')
	async validateOtp(@Body("otp") otp: string, @Req() request: ExpressRequest, @Res() response: Response) {
		try {
			const token = await request.cookies['ddsgnr_otp'];
			if (!token) {
				throw new HttpException("Your OTP has probably expired. Please request a new one", HttpStatus.BAD_REQUEST);
			}
			const validateResponse = await this.authService.validateOtp(otp, token);
			if (validateResponse === true) {
				response.cookie("ddsgnr_otp", null, { httpOnly: true, maxAge: 0 });
				response.cookie("ddsgnr_reset_allow", true, { httpOnly: true, maxAge: 8 * 60 * 1000 });
			}
			return response.send(validateResponse);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Post('reset-password')
	async resetPassword(@Body() dto: ResetPasswordDto, @Req() request: ExpressRequest) {
		try {
			const isAllowed = await request.cookies['ddsgnr_reset_allow'];
			if (isAllowed) {
				return this.authService.resetPassword(dto.email, dto.password);
			}
			throw new HttpException("You are not allowed to reset password, try again later", HttpStatus.BAD_REQUEST);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);

		}
	}

	@Put('update-user')
	async updateUser(@Body() updatedData: Partial<UserDocument>, @Req() request: ExpressRequest, @Res() response: Response) {
		try {
			const token = await request.cookies['ddsgnr_access_token'];
			const result = await this.authService.updateUser(token, updatedData);
			console.log(result);
			response.cookie("update-ddsgnr_access_token", false, { httpOnly: true, maxAge: 60 * 60 * 1000 });
			return result;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


}
