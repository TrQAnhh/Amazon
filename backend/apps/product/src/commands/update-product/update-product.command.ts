import { UpdateProductDto } from '@app/common';

export class UpdateProductCommand {
  constructor(
    public readonly sku: string,
    public readonly updateProductDto: UpdateProductDto,
    public readonly imagePayload?: any,
  ) {}
}
