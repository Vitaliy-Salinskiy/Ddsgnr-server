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
			return newFileName;
		} catch (error) {
			throw new Error(`New file not stored: ${file}`);
		}
	}

	updateFile(oldImagePath: string, newImagePath: string): boolean {
		try {
			if (fs.existsSync(oldImagePath)) {
				fs.unlinkSync(oldImagePath);
			}
			if (fs.existsSync(newImagePath)) {
				fs.renameSync(newImagePath, oldImagePath);
				return true;
			} else {
				throw new Error(`New file not found: ${newImagePath}`);
			}
		} catch (error: any) {
			throw new Error(`Error updating file: ${error.message}`);
		}
	}

	deleteFile(imagePath: string): boolean {
		if (!fs.existsSync(imagePath)) {
			console.log(`File not found: ${imagePath}`);
			return false;
		}

		try {
			fs.unlinkSync(imagePath);
			return true;
		} catch (error: any) {
			throw new Error(`Error deleting image: ${error.message}`);
		}
	}

}
