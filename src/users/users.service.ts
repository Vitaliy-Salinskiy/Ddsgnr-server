import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { IDeleteMessage } from 'src/interfaces';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {

	constructor(@InjectModel(User.name) private userRepository: Model<User>, private fileService: FilesService) { }

	async create(createUserDto: CreateUserDto, image?: Express.Multer.File): Promise<UserDocument> {
		try {
			const candidate = await this.userRepository.findOne({ username: createUserDto.username }).exec();

			if (candidate) {
				throw new HttpException(`User with username ${createUserDto.username} already exists`, HttpStatus.CONFLICT)
			}

			const hashedPasswords: string = await bcrypt.hash(createUserDto.password, 10)

			if (image) {
				createUserDto.image = this.fileService.fileToWebp(image);
			}

			const user = (await this.userRepository.create({ ...createUserDto, password: hashedPasswords })).save();

			return user;
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	async findAll(): Promise<UserDocument[]> {
		try {
			const users = await this.userRepository.find().exec();

			return users;
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	async findOne(id: string): Promise<UserDocument> {
		try {
			const user = await this.userRepository.findById(id).populate("cart").exec();

			if (!user) {
				throw new HttpException(`User with id: ${id} not found`, HttpStatus.NOT_FOUND)
			}

			return user;
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	async findOneByProperties(username: string): Promise<UserDocument> {
		try {
			const user = await this.userRepository.findOne({ username }).exec();

			if (!user) {
				throw new HttpException(`User with username: ${username} not found`, HttpStatus.NOT_FOUND)
			}

			return user;
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	async findOneByEmail(email: string): Promise<UserDocument> {
		try {
			const user = await this.userRepository.findOne({ email }).exec();

			if (!user) {
				throw new HttpException(`User with email: ${email} not found`, HttpStatus.NOT_FOUND)
			}

			return user;
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	async update(id: string, updateUserDto: UpdateUserDto, image?: Express.Multer.File): Promise<UserDocument> {
		try {
			const user = await this.userRepository.findById(id).exec();

			if (!user) {
				throw new HttpException(`User with id: ${id} not found`, HttpStatus.NOT_FOUND);
			}

			if (image) {
				let newImagePath = this.fileService.fileToWebp(image);
				if (user.image) {
					this.fileService.deleteFile(user.image);
				}
				updateUserDto.image = newImagePath;
			}

			if (updateUserDto.password) {
				const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
				updateUserDto.password = hashedPassword;
			}

			if (Object.keys(updateUserDto).length > 0 || image) {
				const updatedUser = await this.userRepository.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
				return updatedUser;
			} else {
				return user;
			}
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async remove(id: string): Promise<IDeleteMessage<UserDocument>> {
		try {
			const user = await this.userRepository.findById(id).exec();

			if (!user) {
				throw new HttpException(`User with id: ${id} not found`, HttpStatus.NOT_FOUND);
			}

			if (user.image) {
				this.fileService.deleteFile(user.image);
			}

			const deletedUser = await this.userRepository.findByIdAndDelete(id).exec();

			return { message: `User with id: ${id} was deleted`, data: { deletedItem: deletedUser } };
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async resetPassword(id: string, newPassword: string) {
		try {
			const newHashedPassword = await bcrypt.hash(newPassword, 10);
			const updatedUser = await this.userRepository.findByIdAndUpdate(id, { password: newHashedPassword }, { new: true }).exec();
			return updatedUser;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}