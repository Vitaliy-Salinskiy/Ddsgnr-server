import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Post()
	@UseInterceptors(FileInterceptor("image"))
	create(@Body() createUserDto: CreateUserDto, @UploadedFile() image?: Express.Multer.File): Promise<UserDocument> {
		return this.usersService.create(createUserDto, image);
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(id);
	}

	@Put(':id')
	@UseInterceptors(FileInterceptor("image"))
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile() image?: Express.Multer.File) {
		return this.usersService.update(id, updateUserDto, image);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(id);
	}

}
