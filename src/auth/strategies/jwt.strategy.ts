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

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'jsonwebtoken';

import { SessionDto } from '../dto/session.dto';

/**
 * JwtStrategy class for handling JWT authentication strategy using JWT.
 *
 * @class JwtStrategy
 * @implements {PassportStrategy}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    /**
     * Creates a new instance of the constructor.
     *
     * @param {ConfigService} configService - The config service for retrieving the secret key used to verify tokens.
     */
    public constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')
        });
    }

    /**
     * Validates a JWT payload and returns a SessionDto object.
     *
     * @param {JwtPayload} payload - The JWT payload to be validated.
     * @return {Promise<SessionDto>} - The validated SessionDto object.
     */
    public async validate(payload: JwtPayload): Promise<SessionDto> {
        return { id: Number.parseInt(payload.id), identity: payload.identity, role: payload.role };
    }
}
