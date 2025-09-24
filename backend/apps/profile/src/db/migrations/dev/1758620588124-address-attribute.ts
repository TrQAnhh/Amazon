import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddressAttribute1758620588124 implements MigrationInterface {
  name = 'AddressAttribute1758620588124';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`profile_entity\`
            ADD \`address\` varchar(255) NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`profile_entity\` DROP COLUMN \`address\`
        `);
  }
}
