import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CheckOutCommand} from "./check-out.command";
import {InjectRepository} from "@nestjs/typeorm";
import {OrderEntity} from "../../entity/order.entity";
import {Repository} from "typeorm";
import {RpcException} from "@nestjs/microservices";

@CommandHandler(CheckOutCommand)
export class CheckOutHandler implements ICommandHandler<CheckOutCommand> {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ) {}

    async execute(command: CheckOutCommand): Promise<void> {
        const order = await this.orderRepository.findOne({
            where: { id: command.orderId },
            relations: ['items'],
        });

        if (!order) throw new RpcException('ORDER_NOT_FOUND');
        console.log(order);
    }
}