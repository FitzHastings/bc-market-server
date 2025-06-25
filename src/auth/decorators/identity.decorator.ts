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

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom parameter decorator that retrieves the user identity from the request object.
 *
 * @param {unknown} data - Optional data parameter. Can be used to customize the behavior of the decorator.
 * @param {ExecutionContext} ctx - The execution context of the currently executing method.
 * @returns {*} The user identity extracted from the request object.
 */
export const Identity = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
);
