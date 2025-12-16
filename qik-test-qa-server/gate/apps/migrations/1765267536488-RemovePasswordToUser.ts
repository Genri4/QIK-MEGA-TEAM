import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePasswordToUser1765267536488 implements MigrationInterface {
    name = 'RemovePasswordToUser1765267536488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_auth_methods_type_enum" AS ENUM('yandex', 'vk', 'password')`);
        await queryRunner.query(`CREATE TABLE "user_auth_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."user_auth_methods_type_enum" NOT NULL, "reference" character varying(255) NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "UQ_4bc657595f1e0b46a7d4ede8dde" UNIQUE ("userId", "type"), CONSTRAINT "PK_07234efa878ec86db5c0274d1e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user_auth_methods" ADD CONSTRAINT "FK_b9378d06d644f849a8d916d18cb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth_methods" DROP CONSTRAINT "FK_b9378d06d644f849a8d916d18cb"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE "user_auth_methods"`);
        await queryRunner.query(`DROP TYPE "public"."user_auth_methods_type_enum"`);
    }

}
