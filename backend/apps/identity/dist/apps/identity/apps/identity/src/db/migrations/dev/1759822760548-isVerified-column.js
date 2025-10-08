"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsVerifiedColumn1759822760548 = void 0;
class IsVerifiedColumn1759822760548 {
    name = 'IsVerifiedColumn1759822760548';
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`identity_entity\`
            ADD \`isVerified\` tinyint NOT NULL DEFAULT 0
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`identity_entity\` DROP COLUMN \`isVerified\`
        `);
    }
}
exports.IsVerifiedColumn1759822760548 = IsVerifiedColumn1759822760548;
//# sourceMappingURL=1759822760548-isVerified-column.js.map