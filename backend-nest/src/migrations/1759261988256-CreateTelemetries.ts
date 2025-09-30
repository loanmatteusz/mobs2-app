import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTelemetries1759261988256 implements MigrationInterface {
    name = 'CreateTelemetries1759261988256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "telemetries" ("id" uuid NOT NULL, "vehicle_id" uuid NOT NULL, "vehicle_plate" character varying NOT NULL, "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, "speed" double precision NOT NULL, "fuel" double precision NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_a16219b9659696b6254a1ac6588" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "telemetries"`);
    }

}
