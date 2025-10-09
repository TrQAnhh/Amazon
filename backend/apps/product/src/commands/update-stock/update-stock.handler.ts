import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStockCommand } from './update-stock.command';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common';
import { RepositoryService } from '@repository/repository.service';

@CommandHandler(UpdateStockCommand)
export class UpdateStockHandler implements ICommandHandler<UpdateStockCommand> {
  constructor(private readonly repository: RepositoryService) {}

  async execute(command: UpdateStockCommand): Promise<boolean> {
    const { items } = command;

    const productIds = items.map((i) => i.productId);
    const products = await this.repository.product.findByIds(productIds);

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) throw new RpcException(ErrorCode.PRODUCT_NOT_FOUND);

      product.availableStock = item.newStock;
    }

    await this.repository.product.saveMany(Array.from(productMap.values()));

    return true;
  }
}
