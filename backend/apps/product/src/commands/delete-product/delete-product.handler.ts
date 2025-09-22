import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../entity/product.entity';
import { Repository } from 'typeorm';
import { assertExists, ErrorCode } from '@app/common';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async execute(command: DeleteProductCommand): Promise<string> {
    const { sku } = command;

    await assertExists<ProductEntity>(this.productRepo, { sku }, ErrorCode.PRODUCT_NOT_FOUND);

    await this.productRepo.update({ sku }, { isDeleted: true });

    return `Product with sku ${sku} has been deleted successfully!`;
  }
}
