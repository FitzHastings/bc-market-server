import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { GeneralEntity } from '../../common/entities/general.entity';
import { Gender } from '../../user/entities/gender.enum';
import { Item } from '../../item/entities/item.entity';

import { PeriodType } from './period-type.enum';

@Entity('market_analytics')
export class MarketAnalytics extends GeneralEntity {
    @ApiProperty({ type: Date, description: 'Timestamp that represents the start of the period' })
    @Column()
    public timestamp: Date;

    @ApiPropertyOptional({
        description: 'Period Type HOUR / DAY',
        enum: Gender,
        enumName: 'PeriodType',
        required: true,
        example: 'DAY'
    })
    @IsEnum(PeriodType)
    @Column({
        type: 'enum',
        enum: PeriodType,
        default: PeriodType.DAY
    })
    public periodType: PeriodType;

    @ApiPropertyOptional({
        description: 'Price of the item at the opening of the period',
        required: true,
        example: '120000'
    })
    @Column('decimal', { precision: 21, scale: 0, default: 0, nullable: true })
    public open?: string;

    @ApiPropertyOptional({
        description: 'Price of the item at the closing of the period',
        required: true,
        example: '120000'
    })
    @Column('decimal', { precision: 21, scale: 0, default: 0, nullable: true })
    public close?: string;

    @ApiPropertyOptional({
        description: 'Maximum Price during the period',
        required: true,
        example: '120000'
    })
    @Column('decimal', { precision: 21, scale: 0, default: 0, nullable: true })
    public high?: string;

    @ApiPropertyOptional({
        description: 'Minimum Price during the period'
    })
    @Column('decimal', { precision: 21, scale: 0, default: 0, nullable: true })
    public low?: string;

    @ApiPropertyOptional({
        description: 'Volume sold during the period',
        required: true,
        example: '120000'
    })
    @Column('decimal', { precision: 21, scale: 0, default: 0, nullable: true })
    public volume?: string;

    @ManyToOne(() => Item, (item) => item.analytics)
    @JoinColumn({ name: 'item_id' })
    public item: Item;

    @ApiPropertyOptional({
        description: 'The number of items sold in the period',
        required: true,
        example: '1000'
    })
    @Index()
    @Column({ nullable: true, name: 'item_id' })
    public itemId: number;
}