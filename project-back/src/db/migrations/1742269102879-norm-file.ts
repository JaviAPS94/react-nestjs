import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormFile1742269102879 implements MigrationInterface {
  name = 'NormFile1742269102879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "norm" ADD "normFile" nvarchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "norm" DROP COLUMN "normFile"`);
  }
}
