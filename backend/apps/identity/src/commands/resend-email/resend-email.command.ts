import { ResendEmailDto } from "@app/common";

export class ResendEmailCommand {
    constructor (
        public readonly resendEmailDto: ResendEmailDto,
    ) {}
}