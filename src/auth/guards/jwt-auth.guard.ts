import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext): TUser {
		const request = context.switchToHttp().getRequest();
		if (request.session && request.session.token) {
			request.headers.authorization = `Bearer ${request.session.token}`;
		}
		return super.handleRequest(err, user, info, context)
	}
}