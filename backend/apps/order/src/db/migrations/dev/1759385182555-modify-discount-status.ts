import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyDiscountStatus1759385182555 implements MigrationInterface {
  name = 'ModifyDiscountStatus1759385182555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`discount_ticket_entity\` CHANGE \`status\` \`status\` enum ('ACTIVE', 'EXPIRED', 'DISABLED') NOT NULL DEFAULT 'ACTIVE'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`discount_ticket_entity\` CHANGE \`status\` \`status\` enum ('ACTIVE', 'EXPIRED', 'DISABLED') NOT NULL
        `);
  }
}
