export class CheckOutCommand {
  constructor(
    public readonly role: string,
    public readonly userId: number,
    public readonly orderId: number,
  ) {}
}
