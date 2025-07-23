import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { GeneralEntity } from '../../common/entities/general.entity';
import { MarketAnalytics } from '../../market/entities/market-analytics.entity';

@Entity('items')
export class Item extends GeneralEntity{
    @ApiPropertyOptional({ description: 'Url of the item image', example: 'https://example.com/image.png' })
    @Column({ name: 'image_url', nullable: true })
    public imageUrl?: string;

    @ApiProperty({ description: 'Bconomy game item ID', example: '120' })
    @Index()
    @Column({ name: 'bc_id' })
    public bcId: number;

    @ApiProperty({ description: 'Name of the item', example: 'Item Name' })
    @Column()
    public name: string;

    @ApiProperty({ description: 'Description of the item', example: 'Item Description' })
    @Column( 'decimal', { precision: 21, scale: 0, default: 0, name: 'base_price' })
    public basePrice: string | number;

    @OneToMany(() => MarketAnalytics, (analytics) => analytics.item)
    public analytics: MarketAnalytics[];
}
