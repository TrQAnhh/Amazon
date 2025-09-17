import { NestFactory } from '@nestjs/core';
import { ProfileModule } from './profile.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

import { Logger } from '@nestjs/common';

const logger = new Logger('Blog');

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(ProfileModule, {
        transport: Transport.TCP,
        options: {
            port: 4002,
        },
    });

    await app.listen();
    logger.log(`TCP Microservice of Profile Service is now running.`);
}
bootstrap();
