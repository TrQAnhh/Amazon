import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaDesgin1758270562087 implements MigrationInterface {
  name = 'SchemaDesgin1758270562087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`product_entity\`
            ADD \`name\` varchar(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\`
            ADD \`description\` text NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\`
            ADD \`imageUrl\` varchar(255) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\`
            ADD \`price\` decimal(10, 2) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\`
            ADD \`quantity\` int NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\`
            ADD \`isDeleted\` tinyint NOT NULL DEFAULT 0
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`product_entity\` DROP COLUMN \`isDeleted\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\` DROP COLUMN \`quantity\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\` DROP COLUMN \`price\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\` DROP COLUMN \`imageUrl\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\` DROP COLUMN \`description\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_entity\` DROP COLUMN \`name\`
        `);
  }
}
