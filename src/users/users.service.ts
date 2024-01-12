import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { IDeleteUserMessage } from 'src/interfaces';


@Injectable()
export class UsersService {

	constructor(@InjectModel(User.name) private userRepository: Model<User>) { }

	async create(createUserDto: CreateUserDto): Promise<UserDocument> {
		try {
			const candidate = await this.userRepository.findOne({ username: createUserDto.username });

			if (candidate) {
				throw new HttpException(`User with username ${createUserDto.username} already exists`, HttpStatus.CONFLICT)
			}

			const hashedPasswords = await bcrypt.hash(createUserDto.password, 10)

			const user = (await this.userRepository.create({ username: createUserDto.username, password: hashedPasswords })).save();

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
			const user = await this.userRepository.findById(id).exec();

			if (!user) {
				throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND)
			}

			return user;
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		try {
			const updatedUser = await this.userRepository.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();

			if (!updatedUser) {
				throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
			}

			return updatedUser;
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async remove(id: string): Promise<IDeleteUserMessage> {
		try {
			const user = await this.userRepository.findByIdAndDelete(id).exec();

			if (!user) {
				throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
			}

			return { message: `User with id ${id} was deleted`, data: { user } };
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
