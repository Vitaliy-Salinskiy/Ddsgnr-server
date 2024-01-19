import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as randomatic from 'randomatic';

@Injectable()
export class OtpService {

	async generateOtp(): Promise<string> {
		try {
			const otp = randomatic('0', 5);
			return otp;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
