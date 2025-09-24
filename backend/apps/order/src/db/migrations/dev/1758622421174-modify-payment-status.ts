import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyPaymentStatus1758622421174 implements MigrationInterface {
  name = 'ModifyPaymentStatus1758622421174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`order_entity\` CHANGE \`paymentStatus\` \`paymentStatus\` enum ('PENDING', 'PAID', 'FAILED', 'CANCELED') NOT NULL DEFAULT 'PENDING'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`order_entity\` CHANGE \`paymentStatus\` \`paymentStatus\` enum ('PENDING', 'PAID', 'FAILED', 'CANCELED') NOT NULL
        `);
  }
}
