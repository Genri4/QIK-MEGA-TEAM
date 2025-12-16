import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1765264072519 implements MigrationInterface {
    name = 'AddPasswordToUser1765264072519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
