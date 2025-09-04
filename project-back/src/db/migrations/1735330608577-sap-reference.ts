import { MigrationInterface, QueryRunner } from 'typeorm';

export class SapReference1735330608577 implements MigrationInterface {
  name = 'SapReference1735330608577';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `EXEC sp_rename "project.dbo.element.sapReference", "sap_refence"`,
    );
    await queryRunner.query(`ALTER TABLE "element" DROP COLUMN "sap_refence"`);
    await queryRunner.query(
      `ALTER TABLE "element" ADD "sap_refence" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "element" DROP COLUMN "sap_refence"`);
    await queryRunner.query(
      `ALTER TABLE "element" ADD "sap_refence" nvarchar(255)`,
    );
    await queryRunner.query(
      `EXEC sp_rename "project.dbo.element.sap_refence", "sapReference"`,
    );
  }
}
