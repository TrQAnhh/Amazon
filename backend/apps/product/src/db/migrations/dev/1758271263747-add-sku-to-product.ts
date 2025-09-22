import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSkuToProduct1758271263747 implements MigrationInterface {
  name = 'AddSkuToProduct1758271263747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`product_entity\`
            ADD \`sku\` varchar(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\`
            ADD UNIQUE INDEX \`IDX_656c3b291988760dcb81dd170c\` (\`sku\`)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`product_entity\` DROP INDEX \`IDX_656c3b291988760dcb81dd170c\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\` DROP COLUMN \`sku\`
        `);
  }
}
