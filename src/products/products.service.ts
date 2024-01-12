import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { FilesService } from 'src/files/files.service';
import { IDeleteMessage } from 'src/interfaces';

@Injectable()
export class ProductsService {

	constructor(@InjectModel(Product.name) private productRepository: Model<Product>, private fileService: FilesService) { }

	async create(createProductDto: CreateProductDto, image: Express.Multer.File): Promise<Product> {
		try {
			createProductDto.image = this.fileService.fileToWebp(image);
			const product = (await this.productRepository.create(createProductDto)).save();
			return product;
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findAll(): Promise<Product[]> {
		try {
			const products = await this.productRepository.find().exec();
			return products;
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findOne(id: string): Promise<Product> {
		try {
			const product = await this.productRepository.findById(id).exec();

			if (!product) {
				throw new HttpException(`Product with id: ${id} not found`, HttpStatus.NOT_FOUND);
			}

			return product;
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async remove(id: string): Promise<IDeleteMessage<ProductDocument>> {
		try {
			const product = await this.productRepository.findById(id).exec();

			if (!product) {
				throw new HttpException(`Product with id: ${id} not found`, HttpStatus.NOT_FOUND);
			}

			this.fileService.deleteFile(product.image);

			const deletedProduct = await this.productRepository.findByIdAndDelete(id).exec();

			return { message: `Product with id: ${id} was deleted`, data: { deletedItem: deletedProduct } };
		} catch (error: any) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
