/* Copyright 2024 Prokhor Kalinin

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

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { GeneralEntity } from '../../common/entities/general.entity';
import { ExternalFile } from '../../file/entities/external-file.entity';

import { Gender } from './gender.enum';

/**
 * User class representing a user entity in the database. Also can be used as a DTO for creating a user
 *
 * @class
 * @name User
 */
@Entity('users')
export class User extends GeneralEntity {
    /**
     * Represents an email address, used for identification during the user's authentication, must be unique, must be not empty.
     *
     * @type {string} username
     */
    @ApiProperty({ description: 'User email', type: String, required: true, example: 'user@mail.su' })
    @IsNotEmpty()
    @IsString()
    @Column({ unique: true, nullable: false })
    public email: string;

    /**
     * The password variable holds a string that represents a user's password.
     *
     * @type {string}
     * @description Stores the password value entered by the user.
     * @name password
     * @since v0.1.0
     */
    @IsString()
    @Column()
    public password: string;

    /**
     * Represents the gender of an individual.
     * @type {string} Gender
     * @description Possible values: "male", "female", "other".
     */
    @ApiPropertyOptional({
        description: 'User gender',
        enum: Gender,
        enumName: 'Gender',
        required: true,
        example: 'UNKNOWN'
    })
    @IsEnum(Gender)
    @IsOptional()
    @Column({
        type: 'enum',
        enum: Gender,
        default: Gender.UNKNOWN
    })
    public gender?: string;

    /**
     * Represents the role of a user within a system.
     * The role is typically used to control access permissions and determine actions that can be performed by the user.
     * Common values might include 'admin', 'editor', 'viewer', etc.
     *
     * @type {string}
     */
    @ApiPropertyOptional({ description: 'User Role', type: String, example: 'ADMIN' })
    @IsString()
    @IsOptional()
    @Column({ default: 'user' })
    public role?: string;

    /**
     * Represents an external image file.
     *
     * @type {ExternalFile}
     *
     * The `image` variable is used to handle an external file containing image data.
     * This can be utilized for tasks such as loading, processing, and displaying
     * images in various formats within the application.
     */
    @ManyToOne(() => ExternalFile, (externalFile) => externalFile.users)
    @JoinColumn({ name: 'image_id' })
    public image?: ExternalFile;

    /**
     * A unique identifier for an image.
     * This ID is used to reference and manage a specific image within the system.
     * It should be a non-negative integer.
     *
     * @type {number}
     */
    @ApiPropertyOptional({ description: 'User Image Id', type: Number, example: 44 })
    @IsInt()
    @IsPositive()
    @IsOptional()
    @Column({ name: 'image_id', nullable: true })
    public imageId?: number;
}
