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

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { morse } from '../utils/morse';
import { report } from '../../winston.config';

@Injectable()
export class BenchmarkInterceptor implements NestInterceptor {
    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest();
        const { method } = request;
        const url = request.originalUrl;
        const start = Date.now();

        return next
            .handle()
            .pipe(
                tap(() => {
                    const time = Date.now() - start;
                    const msg = morse.green('Request ')
                        + morse.magenta(method)
                        + morse.green(' to ')
                        + morse.magenta(url)
                        + morse.green(' took: ')
                        + morse.magenta(`${time}ms`);
                    report.info(msg);
                })
            );
    }
}