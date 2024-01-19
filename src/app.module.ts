import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';

import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CartModule } from './cart/cart.module';
import { OtpService } from './otp/otp.service';
import { OtpModule } from './otp/otp.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env"
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>("MONGO_URI")
			}),
		}),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				transport: {
					host: configService.get<string>("SMTP_HOST"),
					port: configService.get<number>("SMTP_PORT"),
					secure: false,
					auth: {
						user: configService.get<string>("SMTP_USER"),
						pass: configService.get<string>("SMTP_PASSWORD"),
					},
					default: {
						from: `No Reply ${configService.get<string>("SMTP_FROM")}`,
					},
					template: {
						dir: process.cwd() + '/templates/',
						adapter: new HandlebarsAdapter(),
						options: {
							strict: true,
						},
					},
				},
			}),
		}),
		UsersModule,
		FilesModule,
		ProductsModule,
		AuthModule,
		MailModule,
		CartModule,
		OtpModule,
	],
	providers: [OtpService],
})
export class AppModule { }
