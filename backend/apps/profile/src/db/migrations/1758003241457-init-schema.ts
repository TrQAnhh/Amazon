import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1758003241457 implements MigrationInterface {
  name = 'InitSchema1758003241457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`profile_entity\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` int NOT NULL,
                \`firstName\` varchar(255) NOT NULL,
                \`middleName\` varchar(255) NULL,
                \`lastName\` varchar(255) NOT NULL,
                \`avatarUrl\` varchar(255) NULL,
                \`bio\` text NULL,
                UNIQUE INDEX \`IDX_9c0353760c806d01b6f61657a2\` (\`userId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`IDX_9c0353760c806d01b6f61657a2\` ON \`profile_entity\`
        `);
    await queryRunner.query(`
            DROP TABLE \`profile_entity\`
        `);
  }
}
