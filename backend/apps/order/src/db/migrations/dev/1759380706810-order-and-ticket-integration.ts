import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderAndTicketIntegration1759380706810 implements MigrationInterface {
    name = 'OrderAndTicketIntegration1759380706810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user_ticket_entity\` DROP FOREIGN KEY \`FK_4e40114b96f5eb62638bc1eb75f\`
        `);
        await queryRunner.query(`
            CREATE TABLE \`order_ticket_entity\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`amount\` decimal(10, 2) NOT NULL,
                \`orderId\` int NULL,
                \`userTicketId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_ticket_entity\`
            ADD CONSTRAINT \`FK_4e40114b96f5eb62638bc1eb75f\` FOREIGN KEY (\`ticketId\`) REFERENCES \`discount_ticket_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_ticket_entity\`
            ADD CONSTRAINT \`FK_d2981bc762a47f16c937d1cad36\` FOREIGN KEY (\`orderId\`) REFERENCES \`order_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_ticket_entity\`
            ADD CONSTRAINT \`FK_775dab4bb8157bbb492e6a600a9\` FOREIGN KEY (\`userTicketId\`) REFERENCES \`user_ticket_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`order_ticket_entity\` DROP FOREIGN KEY \`FK_775dab4bb8157bbb492e6a600a9\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_ticket_entity\` DROP FOREIGN KEY \`FK_d2981bc762a47f16c937d1cad36\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_ticket_entity\` DROP FOREIGN KEY \`FK_4e40114b96f5eb62638bc1eb75f\`
        `);
        await queryRunner.query(`
            DROP TABLE \`order_ticket_entity\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_ticket_entity\`
            ADD CONSTRAINT \`FK_4e40114b96f5eb62638bc1eb75f\` FOREIGN KEY (\`ticketId\`) REFERENCES \`discount_ticket_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
