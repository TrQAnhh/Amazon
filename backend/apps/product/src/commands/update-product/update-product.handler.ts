import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';
import { ErrorCode } from '@app/common';
import { CloudinaryService } from '@app/common/cloudinary/service/cloudinary.service';
import { RpcException } from '@nestjs/microservices';
import { RepositoryService } from '@repository/repository.service';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    private readonly repository: RepositoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: UpdateProductCommand): Promise<string> {
    const { id, updateProductDto, imagePayload } = command;

    delete updateProductDto.image;

    const product = await this.repository.product.findById(id);

    if (!product) {
      throw new RpcException(ErrorCode.PRODUCT_NOT_FOUND);
    }

    let imageUrl: string | undefined;
    if (imagePayload) {
      imageUrl = await this.cloudinaryService.uploadImage(
        imagePayload.buffer,
        imagePayload.filename,
        imagePayload.mimetype,
      );
    }

    await this.repository.product.update(id, {
      ...updateProductDto,
      ...(imageUrl ? { imageUrl } : {}),
    });

    return `Update product with id ${id} successfully`;
  }
}
