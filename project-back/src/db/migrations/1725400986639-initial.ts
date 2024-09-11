import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1725400986639 implements MigrationInterface {
  name = 'Initial1725400986639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "field" ("id" int NOT NULL IDENTITY(1,1), "base" nvarchar(max) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_1d128114c308bb838a54a865213" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_eede1a748c1aaa586dd01ea5e1b" DEFAULT getdate(), "deleted_at" datetime, CONSTRAINT "PK_39379bba786d7a75226b358f81e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_750c3d29ca1322c5d4c94ba1638" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_83831d38c77f05d52d26c7a07fe" DEFAULT getdate(), "deleted_at" datetime, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "norm" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "version" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_68834400e89af605a1eda09bd9c" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_0bd382dc78119fc47bffae2d06e" DEFAULT getdate(), "deleted_at" datetime, "country_id" int, CONSTRAINT "PK_030f174f0bbc01af1365cdbd872" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "element" ("id" int NOT NULL IDENTITY(1,1), "values" nvarchar(max) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_0e87660c9d69f558f716326cc82" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_4a384391e35b9949f62dc1ba0a7" DEFAULT getdate(), "deleted_at" datetime, "norm_id" int, "type_id" int, CONSTRAINT "PK_6c5f203479270d39efaad8cd82b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "type" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_bca2904a7bd3f58ff9b8338610e" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_3b54740200eda40146ca1c68c88" DEFAULT getdate(), "deleted_at" datetime, "field_id" int, CONSTRAINT "PK_40410d6bf0bedb43f9cadae6fef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "norm" ADD CONSTRAINT "FK_1d4889a88a601fcdc927959a1ee" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "element" ADD CONSTRAINT "FK_9a8f7ad74009e6e7de28c186233" FOREIGN KEY ("norm_id") REFERENCES "norm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "element" ADD CONSTRAINT "FK_ab0085091ed78ccda547c245793" FOREIGN KEY ("type_id") REFERENCES "type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "type" ADD CONSTRAINT "FK_62096ef45975849d2b750badaa8" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "type" DROP CONSTRAINT "FK_62096ef45975849d2b750badaa8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "element" DROP CONSTRAINT "FK_ab0085091ed78ccda547c245793"`,
    );
    await queryRunner.query(
      `ALTER TABLE "element" DROP CONSTRAINT "FK_9a8f7ad74009e6e7de28c186233"`,
    );
    await queryRunner.query(
      `ALTER TABLE "norm" DROP CONSTRAINT "FK_1d4889a88a601fcdc927959a1ee"`,
    );
    await queryRunner.query(`DROP TABLE "type"`);
    await queryRunner.query(`DROP TABLE "element"`);
    await queryRunner.query(`DROP TABLE "norm"`);
    await queryRunner.query(`DROP TABLE "country"`);
    await queryRunner.query(`DROP TABLE "field"`);
  }
}
