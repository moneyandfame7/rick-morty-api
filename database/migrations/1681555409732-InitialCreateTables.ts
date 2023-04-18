import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCreateTables1681555409732 implements MigrationInterface {
    name = 'InitialCreateTables1681555409732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "characters" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "name" character varying NOT NULL, "species" character varying NOT NULL, "gender" character varying NOT NULL, "type" character varying, "image" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "locationId" integer, "originId" integer, CONSTRAINT "PK_9d731e05758f26b9315dac5e378" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "episodes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "episode" character varying NOT NULL, "air_date" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a003fda8b0473fffc39cb831c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "dimension" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying, "email" character varying NOT NULL, "password" character varying, "photo" character varying, "banned" boolean NOT NULL DEFAULT false, "ban_reason" character varying, "auth_type" character varying NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "verify_link" uuid, "mail_subscribe" boolean, "country" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "roleId" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "refresh_token" character varying NOT NULL, "user_id" uuid, CONSTRAINT "REL_8769073e38c365f315426554ca" UNIQUE ("user_id"), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "characters_episodes_episodes" ("charactersId" integer NOT NULL, "episodesId" integer NOT NULL, CONSTRAINT "PK_e8a69d31c05f5ec4621a0becfc6" PRIMARY KEY ("charactersId", "episodesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_59460ddf268318b5635bc02b2d" ON "characters_episodes_episodes" ("charactersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_024978c488012760565a6f2634" ON "characters_episodes_episodes" ("episodesId") `);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_8aa06b804e5ca26d51eb8147b3c" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_994f8f645e6ddb6a8b24c038998" FOREIGN KEY ("originId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "characters_episodes_episodes" ADD CONSTRAINT "FK_59460ddf268318b5635bc02b2db" FOREIGN KEY ("charactersId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "characters_episodes_episodes" ADD CONSTRAINT "FK_024978c488012760565a6f26347" FOREIGN KEY ("episodesId") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters_episodes_episodes" DROP CONSTRAINT "FK_024978c488012760565a6f26347"`);
        await queryRunner.query(`ALTER TABLE "characters_episodes_episodes" DROP CONSTRAINT "FK_59460ddf268318b5635bc02b2db"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_994f8f645e6ddb6a8b24c038998"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_8aa06b804e5ca26d51eb8147b3c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_024978c488012760565a6f2634"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_59460ddf268318b5635bc02b2d"`);
        await queryRunner.query(`DROP TABLE "characters_episodes_episodes"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TABLE "episodes"`);
        await queryRunner.query(`DROP TABLE "characters"`);
    }

}
