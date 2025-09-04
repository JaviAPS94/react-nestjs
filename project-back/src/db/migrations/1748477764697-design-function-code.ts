import { MigrationInterface, QueryRunner } from 'typeorm';

export class DesignFunctionCode1748477764697 implements MigrationInterface {
  name = 'DesignFunctionCode1748477764697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "design_function" ADD "code" varchar(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "design_function" DROP COLUMN "code"`);
  }
}
