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

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../user/entities/user.entity';

import { AccessTokenDto } from './dto/access-token.dto';
import { SessionDto } from './dto/session.dto';

/**
 * AuthService
 *
 * This class provides authentication services for users.
 * It allows users to login and obtain an access token for authentication.
 *
 * @public
 * @class AuthService
 * @constructor
 * @param {JwtService} jwtService - The service for JWT operations.
 * @param {UserService} userService - The service for user operations.
 */
@Injectable()
export class AuthService {
    /**
     * Constructs a new instance of the class.
     *
     * @param {JwtService} jwtService - The JWT service used for token manipulation.
     */
    public constructor(private jwtService: JwtService) {
    }

    /**
     * Performs a login operation for the given user.
     *
     * @param {User} user - The user object containing the login credentials.
     * @param {string} password - The password for the user.
     * @throws {UnauthorizedException} Throws an exception if the email or password is incorrect.
     * @returns {Promise<AccessTokenDto>} Returns a promise that resolves to an AccessTokenDto object containing the access token.
     */
    public async login(user: User, password: string): Promise<AccessTokenDto> {
        if (!await this.validateUser(user, password))
            throw new UnauthorizedException('Email or password is incorrect');

        const payload: SessionDto = { identity: user.email, id: user.id, role: user.role };

        return {
            access_token: this.jwtService.sign(payload)
        };
    }

    /**
     * Validates the user by checking if the provided password matches the user's stored password.
     *
     * @param {User} user - The user object to validate.
     * @param {string} password - The password to verify against the user's stored password.
     * @protected
     *
     * @returns {Promise<boolean>} - A promise that resolves to true if the password is valid, or false if it is not.
     */
    protected async validateUser(user: User, password: string): Promise<boolean> {
        if (!user || !user.password) return false;

        return await bcrypt.compare(password, user.password);
    }
}
