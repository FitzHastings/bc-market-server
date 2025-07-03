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

import { BconomyMessage } from '../dtos/bconomy-message';

/**
 * Bconomy messages have a peculiar structure
 * Its a number concatenated with a string
 * The purpose of the number seems to be related to concurrency control or message demultiplexing
 * This function parses the message and returns the json seperately from the number
 * @param message
 */
export function parseBconomyMessage(message: string): BconomyMessage {
    const result = new BconomyMessage();

    // Check if the message is just a number
    if (/^\d+$/.test(message)) {
        result.pingId = parseInt(message, 10);
        result.json = '';
        return result;
    }

    // Handle case where message starts with a number followed by JSON
    const match = message.match(/^(\d+)(.+)$/);
    if (match) {
        result.pingId = parseInt(match[1], 10);
        result.json = match[2];
        return result;
    }

    // If no pattern matches, return empty result
    result.pingId = 0;
    result.json = '';
    return result;
}