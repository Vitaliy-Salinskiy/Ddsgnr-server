import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';

import { FilesModule } from 'src/files/files.module';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductsService } from './products.service';

@Module({
	imports: [
		MulterModule.registerAsync({
			useFactory: () => ({
				dest: "./uploads/products"
			})
		}),
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
		FilesModule,
		MailModule
	],
	controllers: [ProductsController],
	providers: [ProductsService, MailService],
	exports: [ProductsService]
})
export class ProductsModule { }
