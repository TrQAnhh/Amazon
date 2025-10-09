import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitFinalAmountColumn1759721594068 implements MigrationInterface {
  name = 'InitFinalAmountColumn1759721594068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`order_entity\`
            ADD \`finalAmount\` decimal(10, 2) NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`order_entity\` DROP COLUMN \`finalAmount\`
        `);
  }
}
