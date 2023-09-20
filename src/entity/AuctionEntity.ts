import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skin } from "./SkinEntity";
import { Bid } from "./BidEntity";

@Entity()
export class Auction {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    quantity!: number

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @CreateDateColumn({ type: 'timestamp' })
    final_date!: Date

    @BeforeInsert()
    setFinalDate() {
        this.final_date = new Date();
        this.final_date.setDate(this.final_date.getDate() + 7);
    }

    @OneToOne(() => Skin)
    @JoinColumn()
    skin!: Skin;

    @OneToMany(() => Bid, (bid) => bid.auction)
    bids!: Bid[]

}