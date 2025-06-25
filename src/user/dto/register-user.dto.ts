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

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({ description: 'User\'s email', type: String, example: 's@b.com' })
    @IsString()
    @IsNotEmpty()
    public email: string;

    @ApiProperty({ description: 'User\'s password', type: String, example: 'Password123' })
    @IsString()
    @IsNotEmpty()
    public password: string;
}