import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ProductEntity } from '../../entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductEntity> {
    const { createProductDto } = command;

    const existingProduct = await this.productRepo.findOneBy({
      sku: createProductDto.sku,
    });

    if (existingProduct) {
      throw new RpcException(ErrorCode.PRODUCT_EXISTED);
    }

    const product = this.productRepo.create(createProductDto);
    return await this.productRepo.save(product);
  }
}
