import { Test, TestingModule } from '@nestjs/testing';

import { BconomyController } from './bconomy.controller';

describe('BconomyController', () => {
    let controller: BconomyController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BconomyController]
        }).compile();

        controller = module.get<BconomyController>(BconomyController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
