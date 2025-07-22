import { Column, Entity, Index } from 'typeorm';

import { GeneralEntity } from '../../common/entities/general.entity';

@Entity('items')
export class Item extends GeneralEntity{
    @Column({ name: 'image_url', nullable: true })
    public imageUrl: string;

    @Index()
    @Column({ name: 'bc_id' })
    public bcId: number;

    @Column()
    public name: string;

    @Column( 'decimal', { precision: 21, scale: 0, default: 0, name: 'base_price' })
    public basePrice: string | number;
}
