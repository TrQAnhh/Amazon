import { UpdateProductDto } from '@app/common';

export class UpdateProductCommand {
  constructor(
    public readonly id: number,
    public readonly updateProductDto: UpdateProductDto,
    public readonly imagePayload?: any,
  ) {}
}
