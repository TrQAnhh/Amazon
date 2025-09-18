import { SignUpDto } from "@app/common";

export class SignUpCommand {
    constructor (public readonly signUpDto: SignUpDto) {}
}