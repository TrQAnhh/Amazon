import { MigrationInterface, QueryRunner } from "typeorm";

export class IsVerifiedColumn1759822760548 implements MigrationInterface {
    name = 'IsVerifiedColumn1759822760548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`identity_entity\`
            ADD \`isVerified\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`identity_entity\` DROP COLUMN \`isVerified\`
        `);
    }

}
