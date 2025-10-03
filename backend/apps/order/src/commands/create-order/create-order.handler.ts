import { DiscountType, ErrorCode, PaymentMethod, RedisHelper, SERVICE_NAMES, UserTicketStatus } from '@app/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { getOrderProducts } from '../../helpers/get-order-products.helper';
import { OrderItemEntity } from '../../entity/order-items.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderCommand } from './create-order.command';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { RepositoryService } from '@repository/repository.service';
import { CheckOutCommand } from "../check-out/check-out.command";

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
    constructor(
        @Inject(SERVICE_NAMES.PRODUCT)
        private readonly productClient: ClientProxy,
        private readonly commandBus: CommandBus,
        private readonly repository: RepositoryService,
        private readonly redisHelper: RedisHelper,
    ) {}

    async execute(command: CreateOrderCommand): Promise<string | null> {
        const { role, userId, createOrderDto } = command;

        const lockResources = [
            ...createOrderDto.items.map((item) => `product:${item.productId}`),
            ...(createOrderDto.discountId ? [`ticket:${createOrderDto.discountId}`] : []),
        ];

        const result = await this.redisHelper.withResourceLock(lockResources, async () => {

            const orderItems = await getOrderProducts(
                this.productClient,
                createOrderDto.items.map((item) => item.productId),
            );
            const productsMap = new Map(orderItems.map((p) => [p.id, p]));

            const order = this.repository.order.create({
                userId,
                paymentMethod: createOrderDto.paymentMethod,
                totalAmount: 0,
            });

            let totalAmount = 0;
            const orderItemEntities: OrderItemEntity[] = [];
            const updateStockItems: { productId: number; newStock: number }[] = [];

            for (const item of createOrderDto.items) {
                const product = productsMap.get(item.productId);
                if (!product) throw new RpcException(ErrorCode.PRODUCT_NOT_FOUND);
                if (item.quantity > product.availableStock) throw new RpcException(ErrorCode.ITEM_OUT_OF_STOCK);

                const total = product.price * item.quantity;
                totalAmount += total;

                orderItemEntities.push(
                    this.repository.orderItem.create({
                        productId: product.id,
                        price: product.price,
                        quantity: item.quantity,
                        total,
                    }),
                );

                updateStockItems.push({
                    productId: product.id,
                    newStock: product.availableStock - item.quantity,
                });
            }

            let appliedTicket;
            let discountAmount = 0;

            if (createOrderDto.discountId) {
                const ticket = await this.repository.userTicket.findTicket(userId, createOrderDto.discountId!);
                if (!ticket) throw new RpcException(ErrorCode.TICKET_NOT_FOUND);

                const ticketInfo = ticket.ticket;
                console.log(ticketInfo);
                if (ticketInfo.type === DiscountType.PERCENT) {
                    discountAmount = Math.min(
                        (totalAmount * Number(ticketInfo.value)) / 100,
                        Number(ticketInfo.maxDiscount || totalAmount)
                    );
                } else {
                    discountAmount = Number(ticketInfo.value);
                }
                discountAmount = Math.min(discountAmount, totalAmount);
                totalAmount -= discountAmount;

                ticket.quantity -= 1;
                if (ticket.quantity <= 0) ticket.status = UserTicketStatus.USED;

                ticketInfo.total -= 1;

                await this.repository.userTicket.save(ticket);
                await this.repository.discountTicket.save(ticketInfo);

                appliedTicket = this.repository.orderTicket.create({
                    userTicket: ticket,
                    order,
                    amount: discountAmount,
                });
                await this.repository.orderTicket.save(appliedTicket);
            }

            order.items = orderItemEntities;
            order.totalAmount = totalAmount;
            const savedOrder = await this.repository.order.save(order);

            try {
                await firstValueFrom(this.productClient.send({ cmd: 'update_stock' }, { items: updateStockItems }));
            } catch (err) {
                throw new RpcException(err);
            }

            return { order: savedOrder, appliedTicket };
        });

        if (createOrderDto.paymentMethod === PaymentMethod.STRIPE) {
            return await this.commandBus.execute(new CheckOutCommand(role, userId, result.order.id));
        }

        return `Order created successfully with id ${result.order.id}`;
    }
}
