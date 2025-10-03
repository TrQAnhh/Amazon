import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTicketEntity1759377352048 implements MigrationInterface {
  name = 'InitTicketEntity1759377352048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`discount_ticket_entity\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`code\` varchar(50) NOT NULL,
                \`type\` enum ('PERCENT', 'FIXED', 'FREESHIP', 'GIFT') NOT NULL,
                \`value\` decimal(10, 2) NULL,
                \`minOrderAmount\` decimal(10, 2) NULL,
                \`maxDiscount\` decimal(10, 2) NULL,
                \`startDate\` datetime NOT NULL,
                \`endDate\` datetime NOT NULL,
                \`total\` int NOT NULL,
                \`usageLimit\` int NOT NULL,
                \`status\` enum ('ACTIVE', 'EXPIRED', 'DISABLED') NOT NULL,
                UNIQUE INDEX \`IDX_abd590f9ec4273c9aa0f94f9e2\` (\`code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`user_ticket_entity\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` int NOT NULL,
                \`status\` enum ('AVAILABLE', 'USED') NOT NULL DEFAULT 'AVAILABLE',
                \`ticketId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`user_ticket_entity\`
            ADD CONSTRAINT \`FK_4e40114b96f5eb62638bc1eb75f\` FOREIGN KEY (\`ticketId\`) REFERENCES \`discount_ticket_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user_ticket_entity\` DROP FOREIGN KEY \`FK_4e40114b96f5eb62638bc1eb75f\`
        `);
    await queryRunner.query(`
            DROP TABLE \`user_ticket_entity\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_abd590f9ec4273c9aa0f94f9e2\` ON \`discount_ticket_entity\`
        `);
    await queryRunner.query(`
            DROP TABLE \`discount_ticket_entity\`
        `);
  }
}
