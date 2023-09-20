import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Game {
    @PrimaryColumn({ default: 0 })
    id!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    botBalance!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    gameBalance!: number;
}