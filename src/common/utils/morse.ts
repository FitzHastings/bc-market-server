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

export class Morse {
    public green(s: string): string {
        return `\x1b[32m${s}\x1b[0m`;
    }

    public yellow(s: string): string {
        return `\x1b[33m${s}\x1b[0m`;
    }

    public grey(s: string): string {
        return `\x1b[90m${s}\x1b[0m`;
    }

    public cyan(s: string): string {
        return `\x1b[36m${s}\x1b[0m`;
    }

    public red(s: string): string {
        return `\x1b[31m${s}\x1b[0m`;
    }

    public magenta(s: string): string {
        return `\x1b[35m${s}\x1b[0m`;
    }
}

export const morse = new Morse();