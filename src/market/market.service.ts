import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrimmedGameLog } from '../bconomy/entities/trimmed-game-log.entity';
import { seedItems } from '../item/utils/seed-items';

@Injectable()
export class MarketService implements OnApplicationBootstrap {
    public constructor(
        @InjectRepository(TrimmedGameLog) private readonly trimmedGameLogRepository: Repository<TrimmedGameLog>
    ) {

    }

    public async onApplicationBootstrap(): Promise<void> {
        for (const seedItem of seedItems) {
            // eslint-disable-next-line no-await-in-loop
            const trimmedLogs = await this.trimmedGameLogRepository.find({
                where: { itemId: seedItem.bcId }, order: { date: 'DESC' }
            });
            while (trimmedLogs.length > 0) {
            }
        }
    }
}
