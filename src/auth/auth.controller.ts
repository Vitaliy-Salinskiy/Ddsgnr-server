import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from "express"

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@UseGuards(LocalAuthGuard)
	@Post("login")
	async login(@Request() req: any, @Res() res: Response) {
		try {
			const loginResult = await this.authService.login(req.user);
			if (loginResult) {
				res.cookie("access_token", loginResult.access_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
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

}
