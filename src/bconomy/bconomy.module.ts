import { Module } from '@nestjs/common';

import { BconomyController } from './bconomy.controller';
import { BconomyService } from './bconomy.service';

@Module({
    controllers: [BconomyController],
    providers: [BconomyService],
    exports: [BconomyService]
})
export class BconomyModule {}
