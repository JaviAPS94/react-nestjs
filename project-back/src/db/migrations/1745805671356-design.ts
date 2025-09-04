import { MigrationInterface, QueryRunner } from "typeorm";

export class Design1745805671356 implements MigrationInterface {
    name = 'Design1745805671356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "design_type" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(max) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_60c58aac218b49156215af48749" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_ee68fd9c17a127a45940ff50700" DEFAULT getdate(), "deleted_at" datetime, CONSTRAINT "PK_614c932ab36c5dc6cc02a0cfefe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "design_subtype" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(max) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_f686a5e0075bb7b3b123ed86b36" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_737dbd84d05284e03e386729c3b" DEFAULT getdate(), "deleted_at" datetime, "design_type_id" int, CONSTRAINT "PK_71915ae758f243bdb898faabf8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "design_subtype_function" ("id" int NOT NULL IDENTITY(1,1), "created_at" datetime2 NOT NULL CONSTRAINT "DF_9e9bcc321ece6211cc5b5734c73" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_d6a3941843329dd618ba83d54c0" DEFAULT getdate(), "deleted_at" datetime, "design_subtype_id" int, "design_function_id" int, CONSTRAINT "PK_de2051f1d6c497266344704675f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "design_function" ("id" int NOT NULL IDENTITY(1,1), "name" varchar(100) NOT NULL, "expression" text NOT NULL, "variables" text NOT NULL, "description" text, "created_at" datetime2 NOT NULL CONSTRAINT "DF_c751464f312d2fc753e264b277b" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_b5532b450e1ae1863ca50479eaf" DEFAULT getdate(), "deleted_at" datetime, CONSTRAINT "UQ_25702314087a45df1daca46e387" UNIQUE ("name"), CONSTRAINT "PK_5727bf9a6eadfc5c217c2648c0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_design_function" ("id" int NOT NULL IDENTITY(1,1), "created_at" datetime2 NOT NULL CONSTRAINT "DF_2e2f56d6858c3b9f99cb9fd218b" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_d56aee7d2c133c9b4d15521d207" DEFAULT getdate(), "deleted_at" datetime, "design_function_id" int, "sub_design_id" int, CONSTRAINT "PK_cc3b0082c7f2471509a77d5bead" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_design" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(max) NOT NULL, "code" nvarchar(max) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_fb2a841e670b285b61dbac1f581" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_1b761e2edb12a3380aa1d5e522e" DEFAULT getdate(), "deleted_at" datetime, "design_id" int, CONSTRAINT "PK_2383579bdca9a232612d3b43ab7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "design" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(max) NOT NULL, "code" nvarchar(max) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_234a3a86e4383c1246add43e0ca" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_e0e10e7471f3f13766473ff0c78" DEFAULT getdate(), "deleted_at" datetime, CONSTRAINT "PK_e7a44f12414f03b7f38ff26dc8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "design_element" ("id" int NOT NULL IDENTITY(1,1), "created_at" datetime2 NOT NULL CONSTRAINT "DF_bc9768f27fb55de665c522d64f1" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_92dfd2465cdc4bf733aa702a352" DEFAULT getdate(), "deleted_at" datetime, "design_id" int, "element_id" int, CONSTRAINT "PK_690aacdf9e6cd4962b6d73dd458" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "design_subtype" ADD CONSTRAINT "FK_adf1ddf68eb24b6ee73267ab4fb" FOREIGN KEY ("design_type_id") REFERENCES "design_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "design_subtype_function" ADD CONSTRAINT "FK_50ff11093486d7972d369719c83" FOREIGN KEY ("design_subtype_id") REFERENCES "design_subtype"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "design_subtype_function" ADD CONSTRAINT "FK_b13b3b428409fe433a8148d6f28" FOREIGN KEY ("design_function_id") REFERENCES "design_function"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_design_function" ADD CONSTRAINT "FK_8eb5fd7a5b2a4b9a4485c2822fe" FOREIGN KEY ("design_function_id") REFERENCES "design_function"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_design_function" ADD CONSTRAINT "FK_7ea728beaefb1d21ba53279230b" FOREIGN KEY ("sub_design_id") REFERENCES "sub_design"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_design" ADD CONSTRAINT "FK_fb7f339df2fba66e7c4776d8321" FOREIGN KEY ("design_id") REFERENCES "design"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "design_element" ADD CONSTRAINT "FK_55a4b5bbb1572cbf8540ab3a26b" FOREIGN KEY ("design_id") REFERENCES "design"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "design_element" ADD CONSTRAINT "FK_93ce326fb31e51f462bc2e5045b" FOREIGN KEY ("element_id") REFERENCES "element"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "design_element" DROP CONSTRAINT "FK_93ce326fb31e51f462bc2e5045b"`);
        await queryRunner.query(`ALTER TABLE "design_element" DROP CONSTRAINT "FK_55a4b5bbb1572cbf8540ab3a26b"`);
        await queryRunner.query(`ALTER TABLE "sub_design" DROP CONSTRAINT "FK_fb7f339df2fba66e7c4776d8321"`);
        await queryRunner.query(`ALTER TABLE "sub_design_function" DROP CONSTRAINT "FK_7ea728beaefb1d21ba53279230b"`);
        await queryRunner.query(`ALTER TABLE "sub_design_function" DROP CONSTRAINT "FK_8eb5fd7a5b2a4b9a4485c2822fe"`);
        await queryRunner.query(`ALTER TABLE "design_subtype_function" DROP CONSTRAINT "FK_b13b3b428409fe433a8148d6f28"`);
        await queryRunner.query(`ALTER TABLE "design_subtype_function" DROP CONSTRAINT "FK_50ff11093486d7972d369719c83"`);
        await queryRunner.query(`ALTER TABLE "design_subtype" DROP CONSTRAINT "FK_adf1ddf68eb24b6ee73267ab4fb"`);
        await queryRunner.query(`DROP TABLE "design_element"`);
        await queryRunner.query(`DROP TABLE "design"`);
        await queryRunner.query(`DROP TABLE "sub_design"`);
        await queryRunner.query(`DROP TABLE "sub_design_function"`);
        await queryRunner.query(`DROP TABLE "design_function"`);
        await queryRunner.query(`DROP TABLE "design_subtype_function"`);
        await queryRunner.query(`DROP TABLE "design_subtype"`);
        await queryRunner.query(`DROP TABLE "design_type"`);
    }

}
