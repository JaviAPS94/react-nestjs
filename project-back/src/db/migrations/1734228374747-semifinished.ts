import { MigrationInterface, QueryRunner } from 'typeorm';

export class Semifinished1734228374747 implements MigrationInterface {
  name = 'Semifinished1734228374747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "semi_finished" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "code" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_99470826c10d6f5ab2d993da0e4" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_c485020868926ae9b113988c744" DEFAULT getdate(), "deleted_at" datetime, CONSTRAINT "PK_61ce179bfb44958068b4224c323" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "semi_finished"`);
  }
}
