import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubtypeCodeSpecification1735256664271
  implements MigrationInterface
{
  name = 'SubtypeCodeSpecification1735256664271';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "norm_specification" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "code" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_ed19f6b923523713ee02d24a4c8" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_94dd8ba624696a1374928275c3c" DEFAULT getdate(), "deleted_at" datetime, CONSTRAINT "PK_bbd18ed4017c6ad65305e44379b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "norm" ADD "norm_specification_id" int`,
    );
    await queryRunner.query(`ALTER TABLE "sub_type" ADD "code" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "norm" ADD CONSTRAINT "FK_32d4c0f676d63d583eea1742ec1" FOREIGN KEY ("norm_specification_id") REFERENCES "norm_specification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "norm" DROP CONSTRAINT "FK_32d4c0f676d63d583eea1742ec1"`,
    );
    await queryRunner.query(`ALTER TABLE "sub_type" DROP COLUMN "code"`);
    await queryRunner.query(
      `ALTER TABLE "norm" DROP COLUMN "norm_specification_id"`,
    );
    await queryRunner.query(`DROP TABLE "norm_specification"`);
  }
}
