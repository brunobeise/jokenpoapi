import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Skin {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  quantity!: number;

  @Column()
  price!: number;

  @ManyToMany(() => User, (user) => user.skins)
  users!: User[];
}
