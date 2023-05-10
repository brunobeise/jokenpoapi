import { DataSource } from "typeorm";
import { User } from "./entity/User.entity";
import { WithdrawRequest } from "./entity/WithdrawRequest.entity";
import { Skin } from "./entity/Skin.entity";

export const database = new DataSource({
  type: "postgres",
  host: "motty.db.elephantsql.com",
  port: 5432,
  username: "ziglxmxd",
  password: "NHR5Qetv7bxmT58TEM4kcMP44n6s7nWd",
  database: "ziglxmxd",
  synchronize: true,
  entities: [User, WithdrawRequest, Skin],
  migrations: [],
  migrationsTableName: "custom_migration_table",
});
