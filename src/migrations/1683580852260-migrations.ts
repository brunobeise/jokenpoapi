import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migrations1683580852260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
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
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
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
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("skin");
    await queryRunner.dropTable("user");
    await queryRunner.dropTable(`withdraw_request`);
  }
}
