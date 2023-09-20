import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { User } from "./UserEntity";
import { Marketplace } from "./MarketplaceEntity";
import { Auction } from "./AuctionEntity";

@Entity()
export class Skin {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @ManyToMany(() => User, (user) => user.skins)
  users!: User[];

  @OneToOne(() => Auction, auction => auction.skin)
  auction!: Auction;

  @OneToMany(() => Marketplace, marketplace => marketplace.skin)
  marketplaceListings!: Marketplace[];
}
