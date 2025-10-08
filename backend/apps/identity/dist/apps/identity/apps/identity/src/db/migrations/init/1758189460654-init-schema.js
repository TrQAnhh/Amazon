"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSchema1758189460654 = void 0;
class InitSchema1758189460654 {
    name = 'InitSchema1758189460654';
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`
            DROP INDEX \`IDX_a939d5c90947e69ec666e94e04\` ON \`identity_entity\`
        `);
        await queryRunner.query(`
            DROP TABLE \`identity_entity\`
        `);
    }
}
exports.InitSchema1758189460654 = InitSchema1758189460654;
//# sourceMappingURL=1758189460654-init-schema.js.map