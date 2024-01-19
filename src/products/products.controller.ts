import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) { }

	@Post()
	@UseInterceptors(FilesInterceptor("images"))
	create(@Body() createProductDto: CreateProductDto, @UploadedFiles() images: Array<Express.Multer.File>) {
		return this.productsService.create(createProductDto, images);
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
