import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Request } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) { }

	@UseGuards(JwtAuthGuard)
	@Post()
	@UseInterceptors(FilesInterceptor("images"))
	create(@Body() createProductDto: CreateProductDto, @UploadedFiles() images: Array<Express.Multer.File>) {
		createProductDto.sizes = JSON.parse(createProductDto.sizes);
		createProductDto.colors = JSON.parse(createProductDto.colors);

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

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.productsService.remove(id);
	}

}
