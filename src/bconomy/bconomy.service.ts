
import * as process from 'node:process';

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { delay } from '../common/utils/delay';
import { report } from '../winston.config';
import { morse } from '../common/utils/morse';

import { RichGameLogDto } from './dtos/rich-game-log.dto';
import { trimGameLog } from './interfaces/trim-game-log';
import { TrimmedGameLog } from './entities/trimmed-game-log.entity';

@Injectable()
export class BconomyService implements OnApplicationBootstrap {
    public constructor(@InjectRepository(TrimmedGameLog) private readonly trimmedGameLogRepository: Repository<TrimmedGameLog>) {
    }

    public async onApplicationBootstrap(): Promise<void> {
        if (process.env.BCONOMY_SCRAPE_DATA === 'true')
            await this.migrateLogs();
    }

    public async migrateLogs(): Promise<void> {
        report.info(morse.cyan('Bconomy Service: Performing Logs Migration'));
        try {
            const scapeStart = parseInt(process.env.BCONOMY_SCRAPE_START);
            const scrapeEnd = parseInt(process.env.BCONOMY_SCRAPE_END);

            report.info(morse.cyan('Bconomy Service: Fetching logs from page ')
                + morse.magenta(`${scapeStart}`)
                + morse.cyan(' to page ')
                + morse.magenta(`${scrapeEnd}`)
            );

            for (let i: number = scapeStart; scrapeEnd; i++)
                for (let j = 0; j <= 164; j++)
                    // eslint-disable-next-line no-await-in-loop
                    await this.fetchItemLogsPage(j, i);
        } catch (error) {
            report.error(
                morse.red('Bconomy Service: Failed to migrate logs'),
                morse.red(
                    `Error: ${error.message}\n` +
                    `Stack: ${error.stack}`
                )
            );
        }
    }

    public async fetchItemLogsPage(itemId: number, page: number): Promise<void> {
        report.info(
            morse.cyan('Bconomy Service: Fetching logs for item ')
            + morse.magenta(`#${itemId}`)
            + morse.cyan(' from page ')
            + morse.magenta(`#${page}`)
        );

        const res = await fetch(`${process.env.BCONOMY_API_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.BCONOMY_API_KEY
            },
            body: JSON.stringify({
                type: 'richLogsByIdType',
                idType: 'itemId',
                id: itemId,
                page
            })
        });

        const processed: RichGameLogDto[] = await res.json();
        for (const log of processed) {
            const trimmed = trimGameLog(log);

            // Awaiting to throttle down the scraping
            // eslint-disable-next-line no-await-in-loop
            if (await this.trimmedGameLogRepository.findOne({ where: { bcId: trimmed.bcId } }))
                return;

            report.debug(
                morse.grey('Bconomy Service: Saving trimmed log for item ')
                + morse.magenta(`#${trimmed.itemId}`)
            );
            // Awaiting to throttle down the scraping
            // eslint-disable-next-line no-await-in-loop
            await this.trimmedGameLogRepository.save(trimmed);

            // Delaying not to overload the API
            // eslint-disable-next-line no-await-in-loop
            await delay(500);
        }
    }
}
