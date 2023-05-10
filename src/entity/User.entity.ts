import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { WithdrawRequest } from "./WithdrawRequest.entity";
import { Skin } from "./Skin.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

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
  plays?: number;

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
}
