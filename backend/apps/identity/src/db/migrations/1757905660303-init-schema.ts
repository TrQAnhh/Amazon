import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1757905660303 implements MigrationInterface {
    name = 'InitSchema1757905660303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`identity_entity\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`role\` enum ('user', 'admin', 'shop_owner') NOT NULL DEFAULT 'user',
                UNIQUE INDEX \`IDX_a939d5c90947e69ec666e94e04\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_a939d5c90947e69ec666e94e04\` ON \`identity_entity\`
        `);
        await queryRunner.query(`
            DROP TABLE \`identity_entity\`
        `);
    }

}
