import { MigrationInterface, QueryRunner } from 'typeorm';

export class Templates1752537428010 implements MigrationInterface {
  name = 'Templates1752537428010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "template" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(max), "code" nvarchar(max) NOT NULL, "cellsStyles" text, "cells" text NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_69e781fed3b794d38166c10cd80" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_07a8065dd856d76d7fb20a4b206" DEFAULT getdate(), "deleted_at" datetime, "design_sub_type_id" int, CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ADD CONSTRAINT "FK_5aef22260e1e2d35d8b1ec1fab9" FOREIGN KEY ("design_sub_type_id") REFERENCES "design_subtype"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "template" DROP CONSTRAINT "FK_5aef22260e1e2d35d8b1ec1fab9"`,
    );
    await queryRunner.query(`DROP TABLE "template"`);
  }
}
