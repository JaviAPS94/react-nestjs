import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplateDescription1752621506601 implements MigrationInterface {
  name = 'TemplateDescription1752621506601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "template" ADD "description" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "description"`);
  }
}
