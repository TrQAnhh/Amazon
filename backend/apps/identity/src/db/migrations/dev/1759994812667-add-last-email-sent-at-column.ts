import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastEmailSentAtColumn1759994812667 implements MigrationInterface {
    name = 'AddLastEmailSentAtColumn1759994812667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`identity_entity\`
            ADD \`lastEmailSentAt\` timestamp NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`identity_entity\` DROP COLUMN \`lastEmailSentAt\`
        `);
    }

}
