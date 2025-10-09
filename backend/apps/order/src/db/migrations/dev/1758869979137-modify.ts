import { MigrationInterface, QueryRunner } from 'typeorm';

export class Modify1758869979137 implements MigrationInterface {
  name = 'Modify1758869979137';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`order_entity\` CHANGE \`paymentStatus\` \`paymentStatus\` enum (
                    'PENDING',
                    'PROCESSING',
                    'PAID',
                    'FAILED',
                    'CANCELED'
                ) NOT NULL DEFAULT 'PENDING'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`order_entity\` CHANGE \`paymentStatus\` \`paymentStatus\` enum ('PENDING', 'PAID', 'FAILED', 'CANCELED') NOT NULL DEFAULT 'PENDING'
        `);
  }
}
