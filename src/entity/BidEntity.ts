import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./UserEntity";
import { Auction } from "./AuctionEntity";

@Entity()
export class Bid {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn()
    user!: User;

    @ManyToOne(() => Auction, (auction) => auction.bids, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    auction!: Auction;

    @Column()
    amount!: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;
}
