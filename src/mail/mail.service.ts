import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) { }

	async sendProductData(to: string, productData: Product[]) {
		try {
			let html: string = `
				<h1>Products Data</h1>
				<hr/>
			`;
			let totalPrice: number = 0;

			productData.forEach(product => {
				totalPrice += product.price;
				html += `
					 <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; display: flex; flex-direction: row: gap: 10px">
						<h2>${product.name}</h2>
						<p>Brand: ${product.brand}</p>
						<p>Price: ${product.price}</p>
						<p>Type: ${product.type}</p>
					 </div>
				 `;
			});

			await this.mailerService.sendMail({
				to,
				subject: 'products data',
				html: html += `
					<hr/>
					<h2>Total price: ${totalPrice}</h2>
				`,
			})
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async sendOtp(to: string, otp: string) {
		try {
			await this.mailerService.sendMail({
				to,
				subject: 'Reset password otp ddsgnr',
				html: `
				 <h1>OTP: ${otp}</h1>
			  `,
			});
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}