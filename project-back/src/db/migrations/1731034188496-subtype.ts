import { MigrationInterface, QueryRunner } from 'typeorm';

export class Subtype1731034188496 implements MigrationInterface {
  name = 'Subtype1731034188496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "element" DROP CONSTRAINT "FK_ab0085091ed78ccda547c245793"`,
    );
    await queryRunner.query(
      `ALTER TABLE "type" DROP CONSTRAINT "FK_62096ef45975849d2b750badaa8"`,
    );
    await queryRunner.query(
      `EXEC sp_rename "project.dbo.element.type_id", "subtype_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "sub_type" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_04527130ffe3d0136d2a5d53c2c" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_fcfff43e1a547eeb85be4e205bf" DEFAULT getdate(), "deleted_at" datetime, "field_id" int, "type_id" int, CONSTRAINT "PK_794cc1eaeaa3bda4c067be72fac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "type" DROP COLUMN "field_id"`);
    await queryRunner.query(
      `ALTER TABLE "element" ADD CONSTRAINT "FK_377302d15ea603b2c9497ecc646" FOREIGN KEY ("subtype_id") REFERENCES "sub_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_type" ADD CONSTRAINT "FK_9bda068bb161d37cd7d4eda9b12" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_type" ADD CONSTRAINT "FK_03c977b4458c78a1433432581fa" FOREIGN KEY ("type_id") REFERENCES "type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_type" DROP CONSTRAINT "FK_03c977b4458c78a1433432581fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_type" DROP CONSTRAINT "FK_9bda068bb161d37cd7d4eda9b12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "element" DROP CONSTRAINT "FK_377302d15ea603b2c9497ecc646"`,
    );
    await queryRunner.query(`ALTER TABLE "type" ADD "field_id" int`);
    await queryRunner.query(`DROP TABLE "sub_type"`);
    await queryRunner.query(
      `EXEC sp_rename "project.dbo.element.subtype_id", "type_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "type" ADD CONSTRAINT "FK_62096ef45975849d2b750badaa8" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "element" ADD CONSTRAINT "FK_ab0085091ed78ccda547c245793" FOREIGN KEY ("type_id") REFERENCES "type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
