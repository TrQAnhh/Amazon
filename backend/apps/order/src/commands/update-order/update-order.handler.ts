import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { GetOrderQuery } from '../../queries/get-order/get-order.query';
import { RepositoryService } from '@repository/repository.service';
import { validateOrder } from '../../helpers/validate-order.helper';
import { UpdateOrderCommand } from './update-order.command';
import { PaymentMethod } from '@app/common';
import { CheckOutCommand } from "../check-out/check-out.command";

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler implements ICommandHandler<UpdateOrderCommand> {
  constructor(
    private readonly repository: RepositoryService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: UpdateOrderCommand): Promise<string> {
    const { role, userId, orderId, updateOrderDto } = command;

    const order = await this.queryBus.execute(new GetOrderQuery(role, userId, orderId));

    validateOrder(order, userId, role);

    await this.repository.order.update(orderId, {
      paymentMethod: updateOrderDto.paymentMethod as PaymentMethod,
    });

    if (updateOrderDto.paymentMethod === PaymentMethod.STRIPE) {
      return await this.commandBus.execute(new CheckOutCommand(role, userId, order.id));
    }

    return 'Update order successfully';
  }
}
