import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env"
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>("MONGO_URI") + "ddsgnr",
			}),
		}),
		UsersModule,
		FilesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
