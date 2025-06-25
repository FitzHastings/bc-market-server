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

import { GeneralEntity } from '../entities/general.entity';

/**
 * Represents a collection of entities along with pagination metadata.
 *
 * @template T - The type of entities contained in the collection. Must extend the GeneralEntity interface.
 *
 * @property {T[]} entities - The array of entities retrieved in the current page.
 * @property {number} total - The total number of entities available across all pages.
 */
export interface PagedEntities<T extends GeneralEntity> {
    entities: T[];
    total: number;
}