import { CreateProductDto } from '@app/common';

export class CreateProductCommand {
  constructor(
    public readonly createProductDto: CreateProductDto,
    public readonly imagePayload: any,
  ) {}
}
