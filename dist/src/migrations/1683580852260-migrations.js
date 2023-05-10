"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrations1683580852260 = void 0;
const typeorm_1 = require("typeorm");
class Migrations1683580852260 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "skin",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "description",
                        type: "varchar",
                    },
                    {
                        name: "quantity",
                        type: "int",
                    },
                    {
                        name: "price",
                        type: "numeric",
                        precision: 10,
                        scale: 2,
                    },
                ],
            }), true);
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "user",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "username",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "country",
                        type: "varchar",
                    },
                    {
                        name: "password",
                        type: "varchar",
                    },
                    {
                        name: "avatar",
                        type: "json",
                        isNullable: true,
                    },
                    {
                        name: "wins",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "plays",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "rating",
                        type: "int",
                        default: 1000,
                    },
                    {
                        name: "balance",
                        type: "int",
                        default: 50,
                    },
                    {
                        name: "selectedSkin",
                        type: "uuid",
                        isNullable: true,
                    },
                ],
            }), true);
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "withdraw_request",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "wallet",
                        type: "varchar",
                    },
                    {
                        name: "jokensValue",
                        type: "numeric",
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: "status",
                        type: "boolean",
                    },
                    {
                        name: "create_At",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "motivoNegativa",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "dataAprovacao",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["userId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "user",
                        onDelete: "CASCADE",
                    },
                ],
            }), true);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable("skin");
            yield queryRunner.dropTable("user");
            yield queryRunner.dropTable(`withdraw_request`);
        });
    }
}
exports.Migrations1683580852260 = Migrations1683580852260;
