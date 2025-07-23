import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { startOfHour, startOfDay } from 'date-fns';

import { TrimmedGameLog } from '../bconomy/entities/trimmed-game-log.entity';
import { seedItems } from '../item/utils/seed-items';

import { MarketAnalytics } from './entities/market-analytics.entity';
import { PeriodType } from './entities/period-type.enum';

@Injectable()
export class MarketService implements OnApplicationBootstrap {
    public constructor(
        @InjectRepository(TrimmedGameLog) private readonly trimmedGameLogRepository: Repository<TrimmedGameLog>,
        @InjectRepository(MarketAnalytics) private readonly marketAnalyticsRepository: Repository<MarketAnalytics>
    ) {}

    public async onApplicationBootstrap(): Promise<void> {
        for (const seedItem of seedItems) {
            // eslint-disable-next-line no-await-in-loop
            const trimmedLogs = await this.trimmedGameLogRepository.find({
                where: { itemId: seedItem.bcId },
                order: { date: 'ASC' }
            });

            if (trimmedLogs.length === 0) continue;

            // Process hourly analytics
            // eslint-disable-next-line no-await-in-loop
            await this.processAnalytics(trimmedLogs, seedItem.bcId, PeriodType.HOUR);
            
            // Process daily analytics
            // eslint-disable-next-line no-await-in-loop
            await this.processAnalytics(trimmedLogs, seedItem.bcId, PeriodType.DAY);
        }
    }

    private async processAnalytics(logs: TrimmedGameLog[], itemId: number, periodType: PeriodType): Promise<void> {
        const periods = new Map<string, TrimmedGameLog[]>();

        // Group logs by period
        for (const log of logs) {
            const periodStart = periodType === PeriodType.HOUR 
                ? startOfHour(log.date)
                : startOfDay(log.date);
            
            const key = periodStart.toISOString();
            if (!periods.has(key))
                periods.set(key, []);

            periods.get(key).push(log);
        }

        // Process each period
        for (const [timestamp, periodLogs] of periods) {
            const analytics = new MarketAnalytics();
            analytics.itemId = itemId;
            analytics.timestamp = new Date(timestamp);
            analytics.periodType = periodType;

            // Calculate metrics
            analytics.open = periodLogs[0].price;
            analytics.close = periodLogs[periodLogs.length - 1].price;
            analytics.high = periodLogs.reduce((max, log) => BigInt(log.price) > BigInt(max) ? log.price : max, periodLogs[0].price);
            analytics.low = periodLogs.reduce((min, log) => BigInt(log.price) < BigInt(min) ? log.price : min, periodLogs[0].price);
            
            // Calculate volume and sold amount
            const volume = periodLogs.reduce((sum, log) => BigInt(sum) + BigInt(log.amount), BigInt(0));

            analytics.volume = volume.toString();

            // eslint-disable-next-line no-await-in-loop
            await this.marketAnalyticsRepository.save(analytics);
        }
    }
}