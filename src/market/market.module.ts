import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BconomyModule } from '../bconomy/bconomy.module';

import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { MarketAnalytics } from './entities/market-analytics.entity';


@Module({
    controllers: [MarketController],
    providers: [MarketService],
    imports: [TypeOrmModule.forFeature([MarketAnalytics]), BconomyModule]
})
export class MarketModule {}
