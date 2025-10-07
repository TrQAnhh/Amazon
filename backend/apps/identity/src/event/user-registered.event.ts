export class UserRegisteredEvent {
    constructor(
        public readonly email: string,
        public readonly fistName: string,
        public readonly middleName: string,
        public readonly lastName: string,
    ) {}
}