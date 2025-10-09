export class VerifyEmailQuery {
    constructor(
        public readonly email: string,
        public readonly tokenId: string,
    ) {}
}