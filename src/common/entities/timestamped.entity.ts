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

import { BaseEntity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Represents an entity with timestamp information.
 */
export abstract class TimestampedEntity extends BaseEntity {
    /**
     * Represents the creation date of an entity.
     *
     * @type {Date} createdAt
     * @description The `createdAt` variable is used to store the date and time when an entity was created.
     *
     */
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    /**
     * Represents the last updated date for a specific entity.
     *
     * @type {Date} updatedAt
     * @description The `updatedAt` variable is used to store the date and time when an entity was updated.
     */
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    /**
     * Represents the date and time when an item was deleted. Currently used as a way of knowing if the row was deleted or not
     *
     * @type {Date} deletedAt
     * @description The `deletedAt` variable is used to store the date and time when an entity was deleted.
     */
    @DeleteDateColumn({ type: 'timestamptz' })
    public deletedAt: Date;
}
