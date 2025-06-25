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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ExternalFile } from './entities/external-file.entity';

/**
 * Represents a module responsible for handling files.
 *
 * @module FileModule
 * @requires TypeOrmModule
 * @requires ExternalFile
 * @requires FileController
 * @requires FileService
 */
@Module({
    imports: [TypeOrmModule.forFeature([ExternalFile])],
    controllers: [FileController],
    providers: [FileService],
    exports: [TypeOrmModule]
})
export class FileModule {
}
