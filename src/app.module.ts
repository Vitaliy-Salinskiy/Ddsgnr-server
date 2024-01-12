import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { ProductsModule } from './products/products.module';

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
		UsersModule,
		FilesModule,
		ProductsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
