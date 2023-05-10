"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("./entity/User.entity");
const WithdrawRequest_entity_1 = require("./entity/WithdrawRequest.entity");
const Skin_entity_1 = require("./entity/Skin.entity");
exports.database = new typeorm_1.DataSource({
    type: "postgres",
    host: "motty.db.elephantsql.com",
    port: 5432,
    username: "ziglxmxd",
    password: "NHR5Qetv7bxmT58TEM4kcMP44n6s7nWd",
    database: "ziglxmxd",
    synchronize: true,
    entities: [User_entity_1.User, WithdrawRequest_entity_1.WithdrawRequest, Skin_entity_1.Skin],
    migrations: [],
    migrationsTableName: "custom_migration_table",
});
