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

import { RichGameLogDto } from '../dtos/rich-game-log.dto';
import { TrimmedGameLog } from '../entities/trimmed-game-log.entity';

export function trimGameLog(log: RichGameLogDto): Partial<TrimmedGameLog> {
    const { gameLog } = log;
    return {
        id: gameLog.id,
        senderBcId: gameLog.senderBcId,
        recipientBcId: gameLog.receiverBcId,
        itemId: gameLog.itemId,
        date: new Date(gameLog.date),
        amount: gameLog.data.amount,
        price: gameLog.data.listingPrice
    };
}