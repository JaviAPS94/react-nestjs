import { MigrationInterface, QueryRunner } from 'typeorm';

export class DesignFunctionConstants1748898299167
  implements MigrationInterface
{
  name = 'DesignFunctionConstants1748898299167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "design_function" ADD "constants" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "design_function" DROP COLUMN "constants"`,
    );
  }
}
