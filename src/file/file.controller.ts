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

import { extname } from 'path';
import * as path from 'node:path';

import { BadRequestException, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { IsAdminGuard } from '../auth/guards/is-admin';

import { ExternalFile } from './entities/external-file.entity';
import { FileService } from './file.service';

/**
 * Controller class for handling file operations.
 */
@Controller('file')
@ApiTags('File Module')
export class FileController {
    /**
     * Creates a new instance of the class.
     *
     * @param {FileService} fileService - The file service to be used by the class.
     * @since v0.1.0
     */
    public constructor(private readonly fileService: FileService) {
    }

    /**
     * Uploads a file to the server.
     *
     * @param {Array<ExternalFile>} files - The array of files to be uploaded.
     * @returns {Promise<ExternalFile>} - A promise that resolves to the uploaded file.
     * @since v0.1.0
     */
    @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
    @ApiOkResponse({ type: ExternalFile, description: 'Reified File Handler' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard, IsAdminGuard)
    @ApiOperation({ summary: 'Upload a file' })
    @UseInterceptors(
        FilesInterceptor('file', 10, {
            storage: diskStorage({
                destination: './public',
                filename: (_req, file, cb) => {
                    const randomName = uuid.v4();
                    return cb(null, `${randomName}-${extname(file.originalname)}`);
                }
            })
        })
    )
    @Post('upload')
    public async uploadFile(@UploadedFiles() files: Array<ExternalFile>): Promise<ExternalFile> {
        const file = files[0];
        return await this.fileService.reifyFile(file);
    }

    @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
    @ApiOkResponse({ type: ExternalFile, description: 'Reified File Handler' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard, IsAdminGuard)
    @ApiOperation({ summary: 'Upload a character file' })
    @UseInterceptors(
        FilesInterceptor('file', 10, {
            storage: diskStorage({
                destination: './public',
                filename: (_req, file, cb) => {
                    const randomName = uuid.v4();
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                }
            }),
            fileFilter: (_req, file, callback) => {
                if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/))
                    return callback(new BadRequestException('Only image files are allowed!'), false);
                return callback(null, true);
            }
        })
    )
    @Post('upload/image')
    public async uploadImage(@UploadedFiles() files: Array<Express.Multer.File>): Promise<ExternalFile> {
        if (!files || files.length === 0) throw new BadRequestException('No files uploaded');

        const file = files[0];
        const fullPath = path.resolve('./public', file.filename);

        return await this.fileService.processAndReifyImage(file, fullPath);
    }
}