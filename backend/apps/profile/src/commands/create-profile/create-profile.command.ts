import { SignUpDto } from "@app/common";

export class CreateProfileCommand {
    constructor(
        public readonly userId: number,
        public readonly signUpDto: SignUpDto
    ) {}
}