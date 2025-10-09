import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyQuantity1759385652689 implements MigrationInterface {
  name = 'ModifyQuantity1759385652689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user_ticket_entity\`
            ADD \`quantity\` int NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user_ticket_entity\` DROP COLUMN \`quantity\`
        `);
  }
}
