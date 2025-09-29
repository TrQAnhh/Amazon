import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetOrderQuery } from "../../queries/get-order/get-order.query";
import { RepositoryService } from "@repository/repository.service";
import { validateOrder } from "../../helpers/validate-order.helper";
import { UpdateOrderCommand } from "./update-order.command";
import { PaymentMethod } from "@app/common";



@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler implements ICommandHandler<UpdateOrderCommand> {
    constructor(
        private readonly repository: RepositoryService,
        private readonly queryBus: QueryBus,
    ) {}

    async execute(command: UpdateOrderCommand): Promise<string>  {
        const { role, userId, orderId, updateOrderDto } = command;

        const order = await this.queryBus.execute(new GetOrderQuery(role, userId, orderId));

        validateOrder(order,userId,role);

        await this.repository.order.update(orderId, {
            paymentMethod: updateOrderDto.paymentMethod as PaymentMethod,
        })

        return 'Update order successfully!'
    }
}