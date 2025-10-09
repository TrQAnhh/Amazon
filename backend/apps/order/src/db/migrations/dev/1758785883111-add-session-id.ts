import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessionId1758785883111 implements MigrationInterface {
  name = 'AddSessionId1758785883111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`order_entity\`
            ADD \`sessionId\` varchar(255) NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`order_entity\` DROP COLUMN \`sessionId\`
        `);
  }
}
