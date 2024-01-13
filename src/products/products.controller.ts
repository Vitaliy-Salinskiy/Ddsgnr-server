import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) { }

	@Post()
	@UseInterceptors(FileInterceptor("image"))
	create(@Body() createProductDto: CreateProductDto, @UploadedFile() image: Express.Multer.File) {
		return this.productsService.create(createProductDto, image);
	}

	@Get()
	findAll() {
		return this.productsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.productsService.findOne(id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.productsService.remove(id);
	}
}
