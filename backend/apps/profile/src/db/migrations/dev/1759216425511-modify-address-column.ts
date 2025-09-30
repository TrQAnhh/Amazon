import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyAddressColumn1759216425511 implements MigrationInterface {
    name = 'ModifyAddressColumn1759216425511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`profile_entity\` CHANGE \`address\` \`address\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`profile_entity\` CHANGE \`address\` \`address\` varchar(255) NOT NULL
        `);
    }

}
