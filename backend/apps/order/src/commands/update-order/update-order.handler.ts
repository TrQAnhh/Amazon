import { ErrorCode, PaymentMethod, PaymentStatus, UserRole } from "@app/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetOrderQuery } from "../../queries/get-order/get-order.query";
import { UpdateOrderCommand } from "./update-order.command";
import { RpcException } from "@nestjs/microservices";
import { RepositoryService } from "@repository/repository.service";


@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler implements ICommandHandler<UpdateOrderCommand> {
    constructor(
        private readonly repository: RepositoryService,
        private readonly queryBus: QueryBus,
    ) {}

    async execute(command: UpdateOrderCommand): Promise<string>  {
        const { role, userId, orderId, updateOrderDto } = command;

        const order = await this.queryBus.execute(new GetOrderQuery(role, userId, orderId));

        if (role !== UserRole.ADMIN && order.userId !== userId) {
            throw new RpcException(ErrorCode.UNAUTHORIZED);
        }

        if (order.paymentStatus === PaymentStatus.PAID) {
            throw new RpcException(ErrorCode.ORDER_ALREADY_PAID);
        }

        if (order.paymentStatus === PaymentStatus.PROCESSING) {
            throw new RpcException(ErrorCode.ORDER_PROCESSING);
        }

        await this.repository.order.update(orderId, {
            paymentMethod: updateOrderDto.paymentMethod as PaymentMethod,
        })

        return 'Update order successfully!'
    }
}