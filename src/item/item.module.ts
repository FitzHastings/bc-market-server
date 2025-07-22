import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { Item } from './entities/item.entity';

@Module({
    providers: [ItemService],
    controllers: [ItemController],
    imports: [TypeOrmModule.forFeature([Item])],
    exports: [ItemService]
})
export class ItemModule {}
