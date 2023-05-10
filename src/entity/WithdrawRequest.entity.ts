import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class WithdrawRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column()
  wallet!: string;

  @Column()
  jokensValue!: number;

  @Column()
  status!: boolean;

  @Column()
  create_At!: Date;

  @Column({ nullable: true })
  motivoNegativa!: string;

  @Column({ nullable: true })
  dataAprovacao!: Date;

  @ManyToOne(() => User, (user) => user.withdrawRequests)
  user!: User;
}
