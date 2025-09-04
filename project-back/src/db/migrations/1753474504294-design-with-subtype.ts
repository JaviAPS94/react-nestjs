import { MigrationInterface, QueryRunner } from 'typeorm';

export class DesignWithSubtype1753474504294 implements MigrationInterface {
  name = 'DesignWithSubtype1753474504294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "design" ADD "design_subtype_id" int`);
    await queryRunner.query(
      `ALTER TABLE "design" ADD CONSTRAINT "FK_c8f76cde1035d15f4f7ccf18037" FOREIGN KEY ("design_subtype_id") REFERENCES "design_subtype"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "design" DROP CONSTRAINT "FK_c8f76cde1035d15f4f7ccf18037"`,
    );
    await queryRunner.query(
      `ALTER TABLE "design" DROP COLUMN "design_subtype_id"`,
    );
  }
}
