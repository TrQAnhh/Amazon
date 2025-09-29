import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command';
import { RepositoryService } from "@repository/repository.service";

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    private readonly repository: RepositoryService
  ) {}

  async execute(command: DeleteProductCommand): Promise<string> {
    const { id } = command;

    await this.repository.product.update(id , { isDeleted: true });

    return `Product with id ${id} has been deleted successfully`;
  }
}
