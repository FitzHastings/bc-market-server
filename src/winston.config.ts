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

import * as winston from 'winston';

import { zeroPad } from './common/utils/zero-pad';
import { morse } from './common/utils/morse';

const levelMorse = {
    info: morse.cyan,
    warn: morse.yellow,
    error: morse.red,
    debug: morse.grey
};

export const winstonOptions: winston.LoggerOptions = {
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, context }) => {
            const date = new Date(timestamp as string);
            return levelMorse[level](`${date.getFullYear()}-${zeroPad(`${date.getMonth() + 1}`, 2)}-${zeroPad(`${date.getDate()}`, 2)}`
                    + ` ${zeroPad(`${date.getHours()}`, 2)}:${zeroPad(`${date.getMinutes()}`, 2)}:${zeroPad(`${date.getSeconds()}`, 2)}`)
                + morse.grey(` [${context ?? 'Avalanche'}] `)
                + levelMorse[level](`${level}: `) + message;
        })
    ),
    transports: [
        new winston.transports.File({
            filename: 'last.log',
            level: 'info',
            handleExceptions: true
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize()
            ),
            level: process.env.NODE_ENV === 'debug' ? 'debug' : 'info'
        })
    ],
    exitOnError: false
};

export const report = winston.createLogger(winstonOptions);