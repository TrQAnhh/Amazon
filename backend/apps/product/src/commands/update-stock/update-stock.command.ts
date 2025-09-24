export class UpdateStockCommand {
    constructor(
        public readonly items:{
            productId: number,
            newStock: number,
        }[],
    ){}
}