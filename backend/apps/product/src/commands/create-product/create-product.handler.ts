import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ProductEntity } from '../../entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common';
import { CloudinaryService } from '@app/common/cloudinary/service/cloudinary.service';
import { ProductResponseDto } from '@app/common/dto/product/response';
import { plainToInstance } from 'class-transformer';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductResponseDto> {
    const { createProductDto, imagePayload } = command;

    const existingProduct = await this.productRepo.findOneBy({
      sku: createProductDto.sku,
    });

    if (existingProduct) {
      throw new RpcException(ErrorCode.PRODUCT_EXISTED);
    }

    if (!imagePayload) {
      throw new RpcException(ErrorCode.NO_FILE_PROVIDED);
    }

    const imageUrl = await this.cloudinaryService.uploadImage(
      imagePayload.buffer,
      imagePayload.filename,
      imagePayload.mimetype,
    );

    const product = this.productRepo.create({
      ...createProductDto,
      imageUrl,
    });

    const savedProduct = await this.productRepo.save(product);

    return plainToInstance(ProductResponseDto, savedProduct, {
      excludeExtraneousValues: true,
    });
  }
}
