import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { UpdateOrderCommand } from "./update-order.command";
import { ErrorCode, RepositoryService, UserRole } from "@app/common";
import { GetOrderQuery } from "../../queries/get-order/get-order.query";
import { RpcException } from "@nestjs/microservices";
import { PaymentStatus } from "../../constants/enums/payment-status.enum";
import { PaymentMethod } from "../../constants/enums/payment-method.enum";

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler implements ICommandHandler<UpdateOrderCommand> {
    constructor(
        private readonly repository: RepositoryService,
        private readonly queryBus: QueryBus,
    ) {}

    async execute(command: UpdateOrderCommand): Promise<string>  {
        const { role, userId, orderId, updateOrderDto } = command;

        const order = await this.queryBus.execute(new GetOrderQuery(role, userId, orderId));

        console.log(order);

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