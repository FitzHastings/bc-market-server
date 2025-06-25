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

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

import { report } from '../../winston.config';
import { morse } from '../utils/morse';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    public use(req: Request, _res: Response, next: NextFunction): void {
        if (req.method === 'OPTIONS') {
            next();
            return;
        }

        let { method } = req;
        if (method === 'GET') method = morse.green('GET  ');
        else if (method === 'POST') method = morse.magenta('POST ');
        else if (method === 'PUT') method = morse.yellow('PUT  ');
        else if (method === 'PATCH') method = morse.grey('PATCH');
        else if (method === 'DELETE') method = morse.red('DEL  ');
        else method = morse.magenta(method);

        report.info(morse.cyan('Request ') + method + morse.cyan(' to: ') + morse.magenta(req.originalUrl));

        if (req.body) report.debug(morse.grey(`Body: ${JSON.stringify(req.body)}`));
        next();
    }
}