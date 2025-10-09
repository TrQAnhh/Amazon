import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeStockName1758681894870 implements MigrationInterface {
  name = 'ChangeStockName1758681894870';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`product_entity\` CHANGE \`quantity\` \`availableStock\` int NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`product_entity\` CHANGE \`availableStock\` \`quantity\` int NOT NULL
        `);
  }
}
