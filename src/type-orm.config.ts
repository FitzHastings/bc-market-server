/* Copyright 2025 Prokhor Kalinin

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

import * as process from 'node:process';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTypeOrmModuleOptions(): TypeOrmModuleOptions {
    return {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [`${__dirname}/**/*.entity{.ts,.js}`],
        logging: ['error'],
        synchronize: true,
        ssl: process.env.NODE_ENV !== 'development'
            ? {
                rejectUnauthorized: false
            }
            : false
    };
}