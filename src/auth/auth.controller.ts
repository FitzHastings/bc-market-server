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

import { Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { UserService } from '../user/user.service';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guards/jwt.guard';
import { AccessTokenDto } from './dto/access-token.dto';
import { SessionExtended } from './interfaces/session-extended.interface';
import {Identity} from "./decorators/identity.decorator";
import {User} from "../user/entities/user.entity";

/**
 * AuthController
 *
 * This class is responsible for handling routes related to authentication.
 *
 * @class AuthController
 * @memberof AuthModule
 */
@ApiTags('Authentication Module')
@Controller('auth')
export class AuthController {
    /**
     * Create a new instance of the class.
     *
     * @param {AuthService} authService - The authentication service used for user authentication.
     * @param {UserService} userService - The user service used for retrieving user information.
     */
    public constructor(private authService: AuthService, private userService: UserService) {
    }

    /**
     * Check if the user's token is valid and return the session data.
     *
     * @param {Request} req - The request object sent by the client.
     *
     * @returns {Promise<SessionDto>} The session data of the authenticated user.
     *
     * @throws {UnauthorizedException} If the token is expired or invalid.
     */
    @ApiOkResponse({ type: SessionExtended, description: 'Session data successful retrieval' })
    @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
    @ApiBearerAuth()
    @Get('/')
    @UseGuards(JwtGuard)
    public async check(@Identity() identity: User): Promise<SessionExtended> {
        if (!identity) throw new UnauthorizedException('Your Token Timed Out or is Invalid');
        const user = await this.userService.findOne(identity.id);
        return {
            session: {
                id: identity.id,
                role: identity.role,
                identity: identity.email
            },
            user
        };
    }
    /**
     * Logs in a user with the provided login credentials.
     *
     * @param {LoginDto} loginDto - The login information for the user
     * @return {Promise<AccessTokenDto>} - A Promise resolving to an AccessTokenDTO that contains the access token for the logged in user
     */
    @ApiOkResponse({ type: AccessTokenDto, description: 'Successfully authenticated' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiOperation({ summary: 'Log into the system' })
    @ApiBody({ type: LoginDto, description: 'Login Credentials' })
    @Post('login')
    public async login(@Body() loginDto: LoginDto): Promise<AccessTokenDto> {
        const user = await this.userService.findByIdentity(loginDto.identity);
        if (user === null) throw new UnauthorizedException('Username or password is incorrect');
        return this.authService.login(user, loginDto.password);
    }
}
