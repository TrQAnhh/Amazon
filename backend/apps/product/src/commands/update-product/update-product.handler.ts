import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';
import { ProductEntity } from '../../entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { assertExists, ErrorCode, ProductResponseDto } from '@app/common';
import { CloudinaryService } from '@app/common/cloudinary/service/cloudinary.service';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: UpdateProductCommand): Promise<string> {
    const { id, updateProductDto, imagePayload } = command;

    await assertExists<ProductEntity>(this.productRepo, { id }, ErrorCode.PRODUCT_NOT_FOUND);

    let imageUrl: string | undefined;
    if (imagePayload) {
      imageUrl = await this.cloudinaryService.uploadImage(
        imagePayload.buffer,
        imagePayload.filename,
        imagePayload.mimetype,
      );
    }

    await this.productRepo.update(
      { id },
      {
        ...updateProductDto,
        ...(imageUrl ? { imageUrl } : {}),
      },
    );

    return `Update product with id ${id} successfully!`;
  }
}
