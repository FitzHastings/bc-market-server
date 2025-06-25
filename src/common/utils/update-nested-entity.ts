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

import { Repository } from 'typeorm';

import { GeneralEntity } from '../entities/general.entity';

/**
 * Updates or creates nested entities in the repository based on the provided update data transfer objects (DTOs).
 * Existing entities that are not included in the update DTOs will be soft-deleted.
 *
 * @param {GeneralEntity[]} nestlings - The current list of nested entities.
 * @param {GeneralEntity[]} updateDtos - The list of update DTOs containing data to update existing entities or create new ones.
 * @param {Repository<GeneralEntity>} repo - The repository used to perform database operations on the entities.
 * @return {Promise<GeneralEntity[]>} - A promise that resolves to an array of updated or created entities.
 */
export async function updateNestedEntities(
    nestlings: GeneralEntity[],
    updateDtos: GeneralEntity[],
    repo: Repository<GeneralEntity>
): Promise<GeneralEntity[]> {
    // Constructing Update Lookup
    const pendingCandidates = nestlings?.length > 0 ? new Map(nestlings.map((candidate) => [candidate.id, candidate])) : new Map();
    const sentForUpdate = updateDtos.filter((candidate) => candidate.id !== undefined);

    const updatedNestlings: GeneralEntity[] = [];
    for (const dtoForUpdate of sentForUpdate) {
        const nestling = pendingCandidates.get(dtoForUpdate.id);
        if (!nestling) continue;
        updatedNestlings.push(Object.assign(nestling, dtoForUpdate));
        pendingCandidates.delete(nestling.id);
    }

    // Updating Candidates
    if (updatedNestlings.length > 0)
        await repo.save(updatedNestlings);

    // Removing Candidates that were not sent for update
    if (pendingCandidates.size > 0)
        await repo.softDelete([...pendingCandidates.keys()]);

    // Creating new Entities
    const entitiesToCreate = updateDtos.filter((permission) => permission.id === undefined || permission.id < 0);
    const createdNestlings = await repo.save(entitiesToCreate);
    return [...createdNestlings, ...updatedNestlings];
}
