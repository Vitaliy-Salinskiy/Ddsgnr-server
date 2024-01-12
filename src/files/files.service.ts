import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesService {

	fileToWebp(file: Express.Multer.File): string {
		try {
			const newFileName: string = `${file.filename}.webp`;
			const newFilePath: string = path.join(path.dirname(file.path), newFileName);
			fs.renameSync(file.path, newFilePath);
			file.path = newFilePath;
			return file.path;
		} catch (error) {
			throw new Error(`New file not stored: ${file}`);
		}
	}

	deleteFile(imagePath: string): boolean {
		const baseDir = process.cwd();
		const fullOldImagePath = path.join(baseDir, imagePath);

		if (!fs.existsSync(fullOldImagePath)) {
			console.log(`File not found: ${imagePath}`);
			return false;
		}

		try {
			fs.unlinkSync(fullOldImagePath);
			return true;
		} catch (error: any) {
			throw new Error(`Error deleting image: ${error.message}`);
		}
	}

}