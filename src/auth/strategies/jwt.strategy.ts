import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from "express";
import { IPayload } from "src/interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: (req: Request) => {
				let token: null | string = null;
				if (req && req.session) {
					token = req.session["token"];
				}
				return token;
			},
			ignoreExpiration: false,
			secretOrKey: configService.get<string>("JWT_SECRET", "qwerty")
		});
	}

	async validate(payload: IPayload) {
		return { userId: payload.sub, username: payload.username, email: payload.email, image: payload.image, cart: payload.cart };
	}
}