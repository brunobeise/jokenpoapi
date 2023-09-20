import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { WithdrawRequest } from "./WithdrawRequestEntity";
import { Skin } from "./SkinEntity";
import UserRepository from "../repository/UserRepository";
import { Marketplace } from "./MarketplaceEntity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true, nullable: true })
  email!: string;

  @Column({ nullable: true })
  wallet!: string;

  @Column()
  country!: string;

  @Column({ nullable: false })
  password!: string;

  @Column("json", { nullable: true })
  avatar?: {
    style: string;
    hairColor: string;
    facialHair: string;
    clothe: string;
    clotheColor: string;
    skin: string;
    eye: string;
    eyebrow: string;
    mouth: string;
    top: string;
    acessories: string;
  };

  @Column({ default: 0 })
  wins?: number;

  @Column({ default: 0 })
  matches?: number;

  @Column({ default: 1000 })
  rating!: number;

  @Column({ default: 50 })
  balance?: number;

  @Column({ nullable: true })
  selectedSkin!: string;

  @OneToMany((type) => WithdrawRequest, (solicitacao) => solicitacao.userId)
  withdrawRequests!: WithdrawRequest[];

  @ManyToMany(() => Skin)
  @JoinTable({ name: "users_skins" })
  skins!: Skin[];

  @OneToMany(() => Marketplace, marketplace => marketplace.user)
  marketplaceListings!: Marketplace[];

  async toDetail() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      wallet: this.wallet,
      avatar: this.avatar,
      balance: this.balance,
      country: this.country,
      wins: this.wins,
      matches: this.matches,
      rating: this.rating,
      position: await new UserRepository().getUserPosition(this.id),
      skins: this.skins,
      selectedSkin: this.selectedSkin
    }
  }
}
