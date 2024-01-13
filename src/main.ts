import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as serveStatic from 'serve-static';


async function bootstrap() {
	const PORT = process.env.PORT || 5000;
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());

	app.enableCors({
		origin: true,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true
	})

	app.use("/uploads", serveStatic("uploads", {
		maxAge: "1d",
		extensions: ["webp"]
	}));

	await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

bootstrap();