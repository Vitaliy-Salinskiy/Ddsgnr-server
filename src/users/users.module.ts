import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { FilesModule } from 'src/files/files.module';

@Module({
	imports: [
		MulterModule.registerAsync({
			useFactory: () => ({
				dest: './uploads/users',
			}),
		}),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		FilesModule
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService]
})
export class UsersModule { }
