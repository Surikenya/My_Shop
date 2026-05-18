import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultImageToProduct1778925411695 implements MigrationInterface {
    name = 'AddDefaultImageToProduct1778925411695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "defaultImage" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "defaultImage"`);
    }

}
