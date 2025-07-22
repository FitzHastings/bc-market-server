import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { report } from '../winston.config';
import { morse } from '../common/utils/morse';

import { Item } from './entities/item.entity';
import { seedItems } from './utils/seed-items';

@Injectable()
export class ItemService implements OnModuleInit {
    public constructor(
        @InjectRepository(Item) private readonly itemRepository: Repository<Item>
    ) {
    }

    public async onModuleInit(): Promise<void> {
        report.info(morse.cyan('Item Service: Performing Seeding'));
        const seedPromises = [];

        const extantItems = new Map<number, Item | null>();
        for (const seedItem of seedItems)
            seedPromises.push(this.itemRepository.findOne({ where: { bcId: seedItem.bcId } }).then((item) => extantItems.set(seedItem.bcId, item)));
        await Promise.all(seedPromises);

        for (const bcId of extantItems.keys()) {
            const item = extantItems.get(bcId);
            if (!item) {
                const seedData = seedItems.find((seedItem) => seedItem.bcId === bcId);
                report.info(
                    morse.cyan('Item Service: Seeding item bcId: ')
                    + morse.magenta(`#${seedData.bcId}`)
                    + morse.cyan(' - ')
                    + morse.magenta(`${seedData.name}`)
                );
                this.itemRepository.save(seedData);
            } else {
                report.info(
                    morse.green('Item Service: item bcId: ')
                    + morse.magenta(`#${bcId}`)
                    + morse.green(' found - skipping...')
                );
            }
        }
    }
}
