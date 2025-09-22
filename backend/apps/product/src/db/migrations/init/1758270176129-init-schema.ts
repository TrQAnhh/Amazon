import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1758270176129 implements MigrationInterface {
  name = 'InitSchema1758270176129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`product_entity\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE \`product_entity\`
        `);
  }
}
