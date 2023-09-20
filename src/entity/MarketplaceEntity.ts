import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./UserEntity";
import { Skin } from "./SkinEntity";

@Entity()
export class Marketplace {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, user => user.marketplaceListings)
    @JoinColumn()
    user!: User;

    @ManyToOne(() => Skin, skin => skin.marketplaceListings)
    @JoinColumn()
    skin!: Skin;

    @Column()
    price!: number;

    @Column({ type: "timestamp", nullable: true })
    soldDate?: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;
}




