export class GetOrderQuery {
  constructor(
    public readonly role: string,
    public readonly userId: number,
    public readonly orderId: number,
  ) {}
}
