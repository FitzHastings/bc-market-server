/* Copyright 2025 Prokhor Kalinin

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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BconomyService } from './bconomy.service';
import { TrimmedGameLog } from './entities/trimmed-game-log.entity';

@Module({
    providers: [BconomyService],
    exports: [BconomyService],
    imports: [TypeOrmModule.forFeature([TrimmedGameLog])]
})
export class BconomyModule {}
