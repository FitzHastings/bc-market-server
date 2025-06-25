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

import { FindManyOptions } from 'typeorm';

import { GeneralEntity } from '../entities/general.entity';

const MAX_PAGE_SIZE = 50;

export function generatePagingOptions(page = 1, limit = MAX_PAGE_SIZE): FindManyOptions<GeneralEntity> {
    const trueLimit = Math.min(MAX_PAGE_SIZE, limit);
    const offset = (page - 1) * trueLimit;

    return {
        skip: offset,
        take: trueLimit
    };
}