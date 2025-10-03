export class CancelOrderCommand {
  constructor(
    public readonly role: string,
    public readonly userId: number,
    public readonly orderId: number,
  ) {}
}
