import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubDesignData1753134579961 implements MigrationInterface {
  name = 'SubDesignData1753134579961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sub_design" ADD "data" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sub_design" DROP COLUMN "data"`);
  }
}
