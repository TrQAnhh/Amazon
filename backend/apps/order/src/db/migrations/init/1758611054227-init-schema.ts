import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1758611054227 implements MigrationInterface {
  name = 'InitSchema1758611054227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`order_item_entity\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`productId\` int NOT NULL,
                \`quantity\` int NOT NULL,
                \`price\` decimal(10, 2) NOT NULL,
                \`total\` decimal(10, 2) NOT NULL,
                \`orderId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`order_entity\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` int NOT NULL,
                \`totalAmount\` decimal(10, 2) NOT NULL,
                \`status\` enum (
                    'PENDING',
                    'PAID',
                    'FAILED',
                    'SHIPPED',
                    'COMPLETED',
                    'CANCELED'
                ) NOT NULL DEFAULT 'PENDING',
                \`paymentMethod\` enum ('STRIPE', 'COD') NOT NULL,
                \`paymentStatus\` enum ('PENDING', 'PAID', 'FAILED', 'CANCELED') NOT NULL,
                \`intentId\` varchar(255) NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`order_item_entity\`
            ADD CONSTRAINT \`FK_cd7ee8cfd1250200aa78d806f8d\` FOREIGN KEY (\`orderId\`) REFERENCES \`order_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`order_item_entity\` DROP FOREIGN KEY \`FK_cd7ee8cfd1250200aa78d806f8d\`
        `);
    await queryRunner.query(`
            DROP TABLE \`order_entity\`
        `);
    await queryRunner.query(`
            DROP TABLE \`order_item_entity\`
        `);
  }
}
