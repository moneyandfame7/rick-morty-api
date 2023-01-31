import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialUserTable1675161788941 implements MigrationInterface {
    name = 'InitialUserTable1675161788941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters_episodes_episodes" DROP CONSTRAINT "FK_024978c488012760565a6f26347"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "banned" boolean NOT NULL DEFAULT false, "banReason" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "characters_episodes_episodes" ADD CONSTRAINT "FK_024978c488012760565a6f26347" FOREIGN KEY ("episodesId") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters_episodes_episodes" DROP CONSTRAINT "FK_024978c488012760565a6f26347"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "characters_episodes_episodes" ADD CONSTRAINT "FK_024978c488012760565a6f26347" FOREIGN KEY ("episodesId") REFERENCES "episodes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
