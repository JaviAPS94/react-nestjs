import { MigrationInterface, QueryRunner } from 'typeorm';

export class CountryCode1734303557223 implements MigrationInterface {
  name = 'CountryCode1734303557223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "country" ADD "isoCode" nvarchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "country" DROP COLUMN "isoCode"`);
  }
}
