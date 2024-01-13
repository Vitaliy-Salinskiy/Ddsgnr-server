import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { FilesModule } from 'src/files/files.module';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';

@Module({
	imports: [
		MulterModule.registerAsync({
			useFactory: () => ({
				dest: './uploads/users',
			}),
		}),
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Product.name, schema: ProductSchema },
		]),
		FilesModule
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService]
})
export class UsersModule { }
