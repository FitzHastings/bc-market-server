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

import * as process from 'node:process';

import { EntityNotFoundError, In, Repository } from 'typeorm';

import { GeneralEntity } from '../entities/general.entity';

/**
 * Asynchronously loads nestling entities based on their IDs.
 *
 * @param {GeneralEntity[]} nestlings - Array of GeneralEntity objects representing the nestlings to be loaded.
 * @param {Repository<GeneralEntity>} repository - Repository instance used to fetch the nestling entities.
 * @return {Promise<GeneralEntity[]>} - A promise that resolves to an array of loaded GeneralEntity objects.
 */
export async function loadNestlings(nestlings: GeneralEntity[], repository: Repository<GeneralEntity>): Promise<GeneralEntity[]> {
    const ids = nestlings.map((entity) => entity.id);
    return await loadNestlingWithIds(ids, repository);
}

/**
 * Loads a list of general entities based on provided IDs from the repository.
 *
 * @param {number[]} ids - An array of IDs for the entities to be loaded.
 * @param {Repository<GeneralEntity>} repository - The repository instance to fetch the entities from.
 * @param {Array<keyof GeneralEntity>} [overviewFields=[]] - Optional array of fields to be selected in the fetched entities.
 * @return {Promise<GeneralEntity[]>} - A promise that resolves to an array of general entities.
 */
export async function loadNestlingWithIds(
    ids: number[], repository: Repository<GeneralEntity>,
    overviewFields: Array<keyof GeneralEntity> = []
): Promise<GeneralEntity[]> {
    if (ids?.length > 0) {
        const baseline = await repository.find({
            where: { id: In(ids) },
            select: overviewFields.length > 0 ? overviewFields : undefined
        });
        if (baseline.length !== baseline.length) throw new EntityNotFoundError('One or more Nested Entities were not found', '');
        return baseline;
    }

    // Avoids Zalgo by forcing the function to always behave asynchronously.
    return new Promise<GeneralEntity[]>((resolve) => {
        process.nextTick(async () => resolve([]));
    });
}