import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpecialItem1735330413350 implements MigrationInterface {
  name = 'SpecialItem1735330413350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "special_item" ("id" int NOT NULL IDENTITY(1,1), "letter" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_517c5ab9cdc1422b2a93120b6a3" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_62a0baa5f532d008727a202d3e9" DEFAULT getdate(), "deleted_at" datetime, CONSTRAINT "PK_d1a6fecd30ece3850ef31c7b177" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "element" ADD "sapReference" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "element" ADD "special_item_id" int`);
    await queryRunner.query(
      `ALTER TABLE "element" ADD CONSTRAINT "FK_c7a5142b73a541e7d791de59109" FOREIGN KEY ("special_item_id") REFERENCES "special_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "element" DROP CONSTRAINT "FK_c7a5142b73a541e7d791de59109"`,
    );
    await queryRunner.query(
      `ALTER TABLE "element" DROP COLUMN "special_item_id"`,
    );
    await queryRunner.query(`ALTER TABLE "element" DROP COLUMN "sapReference"`);
    await queryRunner.query(`DROP TABLE "special_item"`);
  }
}
