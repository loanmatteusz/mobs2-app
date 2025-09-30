import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTelemetries1759178146465 implements MigrationInterface {
    name = 'CreateTelemetries1759178146465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "telemetries" ALTER COLUMN "id" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "telemetries" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }

}
