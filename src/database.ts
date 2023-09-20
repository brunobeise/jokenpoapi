import { DataSource } from "typeorm";
import { User } from "./entity/UserEntity";
import { WithdrawRequest } from "./entity/WithdrawRequestEntity";
import { Skin } from "./entity/SkinEntity";
import { Game } from "./entity/GameEntity";
import { Marketplace } from "./entity/MarketplaceEntity";
import { Auction } from "./entity/AuctionEntity";
import { Bid } from "./entity/BidEntity";

export const database = new DataSource({
  type: "postgres",
  host: "ep-restless-lab-43830056-pooler.us-east-1.postgres.vercel-storage.com",
  port: 5432,
  username: "default",
  password: "D4LbtiQP9ahK",
  database: "verceldb",
  synchronize: true,
  entities: [User, WithdrawRequest, Skin, Game, Marketplace, Auction, Bid],
  migrations: [],
  ssl: true,
  migrationsTableName: "custom_migration_table",
});
