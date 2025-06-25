/* Copyright 2024 - 2025 Prokhor Kalinin

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import * as path from 'node:path';
import * as fs from 'node:fs';

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import { Metadata } from 'sharp';

import { report } from '../winston.config';
import { morse } from '../common/utils/morse';

import { ExternalFile } from './entities/external-file.entity';

/**
 * Service class for handling file operations.
 *
 * @module FileService
 */
@Injectable()
export class FileService implements OnApplicationBootstrap {
    /**
     * Constructs a new instance of the class.
     *
     * @param {Repository<ExternalFile>} fileRepository - The repository for external files.
     */
    public constructor(@InjectRepository(ExternalFile) private readonly fileRepository: Repository<ExternalFile>) {
    }

    public async onApplicationBootstrap(): Promise<void> {
        report.info(morse.cyan('File Service: Performing Orphaned Images Purge'));
        const orphanedFiles = await this.fileRepository
            .createQueryBuilder('files')
            .leftJoin('users', 'users', 'users.image_id = files.id')
            .where('users.id IS NULL')
            .andWhere('files.is_image = true')
            .getMany();

        report.info(morse.cyan('Orphaned Images Purge: Found ') + morse.magenta(`${orphanedFiles.length}`) + morse.cyan(' orphaned images.'));

        if (orphanedFiles.length <= 0) {
            report.info(morse.green('Orphaned Images Purge: Skipping purge. No orphaned images found.'));
            return;
        }

        report.info(morse.cyan('Orphaned Images Purge: Purging external files'));
        for (const file of orphanedFiles) 
            try {
                // Delete all variations of the image
                const filesToDelete = [
                    file.path,
                    file.optimizedPath,
                    file.path512h,
                    file.path256h,
                    file.path128h,
                    file.path64h
                ].filter(Boolean); // Remove null/undefined paths

                for (const filePath of filesToDelete) 
                    if (filePath)
                        // Supressed as a non time sensitive task
                        // eslint-disable-next-line no-await-in-loop
                        await fs.promises.unlink(filePath).catch(() => {
                            // Ignore errors if file doesn't exist
                        });
                
                report.info(morse.green('Orphaned Images Purge: Successfully purged external files'));
            } catch (error) {
                report.error(`Failed to delete files for ExternalFile ID ${file.id}:`, error);
            }

        // Delete the database records
        report.info(morse.cyan('Orphaned Images Purge: purging external file records from the database'));
        await this.fileRepository.softDelete(orphanedFiles.map((file) => file.id));
        report.info(morse.green('Orphaned Images Purge: Successfully purged external file records from the database'));
    }

    /**
     * Reify the given file by saving it to the file repository.
     *
     * @param {ExternalFile} file - The file to be reified.
     * @returns {Promise<ExternalFile>} - A promise that resolves with the reified file.
     */
    public async reifyFile(file: ExternalFile): Promise<ExternalFile> {
        return await this.fileRepository.save(file);
    }

    /**
     * Processes an uploaded file: saves original, converts to JPG, resizes, and stores metadata.
     * @param file The uploaded file object from Multer.
     * @param originalPath Path to the uploaded file on disk.
     */
    public async processAndReifyImage(file: Express.Multer.File, originalPath: string): Promise<ExternalFile> {
        const baseName = path.basename(originalPath, path.extname(originalPath));
        const uploadDir = path.dirname(originalPath);

        const webpPath = path.join(uploadDir, `${baseName}.webp`);
        const path512h = path.join(uploadDir, `${baseName}_512h.webp`);
        const path256h = path.join(uploadDir, `${baseName}_256h.webp`);
        const path128h = path.join(uploadDir, `${baseName}_128h.webp`);
        const path64h = path.join(uploadDir, `${baseName}_128h.webp`);

        const savedFile = await this.reifyFile(file as unknown as ExternalFile);
        await sharp(originalPath)
            .webp({ quality: 90 })
            .toFile(webpPath);
        const metadata = await sharp(webpPath).metadata();
        if (!metadata.width || !metadata.height) throw new Error('Invalid image dimensions');

        await this.generateThumbnail(metadata, webpPath, path512h, 512);
        await this.generateThumbnail(metadata, webpPath, path256h, 256);
        await this.generateThumbnail(metadata, webpPath, path128h, 128);
        await this.generateThumbnail(metadata, webpPath, path64h, 64);

        savedFile.optimizedPath = `public/${baseName}.webp`;
        savedFile.path512h = `public/${baseName}_512h.webp`;
        savedFile.path256h = `public/${baseName}_256h.webp`;
        savedFile.path128h = `public/${baseName}_128h.webp`;
        savedFile.path64h = `public/${baseName}_64h.webp`;
        return await this.fileRepository.save(savedFile);
    }

    private async generateThumbnail(metadata: Metadata, sourcePath: string, destinationPath: string, height: number): Promise<void> {
        const width = Math.round((metadata.width / metadata.height) * height);
        await sharp(sourcePath).resize(width, height).toFile(destinationPath);
    }
}
