import { ErrorCode, PaymentMethod, RedisHelper, SERVICE_NAMES } from '@app/common';
import { applyDiscountTicket } from '../../helpers/apply-discount-ticket.helper';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { getOrderProducts } from '../../helpers/get-order-products.helper';
import { RepositoryService } from '@repository/repository.service';
import { OrderItemEntity } from '../../entity/order-items.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CheckOutCommand } from '../check-out/check-out.command';
import { CreateOrderCommand } from './create-order.command';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

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
      ...(createOrderDto.freeshipId ? [`freeship:${createOrderDto.freeshipId}`] : []),
      ...(createOrderDto.discountId ? [`discount:${createOrderDto.discountId}`] : []),
    ];

    const order = this.repository.order.create({
      userId,
      paymentMethod: createOrderDto.paymentMethod,
      totalAmount: 0,
      finalAmount: 0,
    });

    const savedOrder = await this.redisHelper.withResourceLock(lockResources, async () => {
      const orderItems = await getOrderProducts(
        this.productClient,
        createOrderDto.items.map((item) => item.productId),
      );
      const productsMap = new Map(orderItems.map((p) => [p.id, p]));

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

      let finalAmount = totalAmount;
      let discountAmount = 0;
      let discountTicket: any;

      if (createOrderDto.discountId) {
        const discountResult = await applyDiscountTicket(
          this.repository,
          userId,
          createOrderDto.discountId,
          totalAmount,
        );
        finalAmount = discountResult.finalAmount;
        discountAmount = discountResult.discountAmount;
        discountTicket = discountResult.ticket;
      }

      order.items = orderItemEntities;
      order.totalAmount = totalAmount;
      order.finalAmount = finalAmount;
      const savedOrder = await this.repository.order.save(order);

      if (discountTicket) {
        const appliedTicket = this.repository.orderTicket.create({
          order: savedOrder,
          userTicket: discountTicket,
          amount: discountAmount,
        });
        await this.repository.orderTicket.save(appliedTicket);
      }

      try {
        await firstValueFrom(this.productClient.send({ cmd: 'update_stock' }, { items: updateStockItems }));
      } catch (err) {
        throw new RpcException(err);
      }

      return savedOrder;
    });

    if (createOrderDto.paymentMethod === PaymentMethod.STRIPE) {
      return await this.commandBus.execute(new CheckOutCommand(role, userId, savedOrder.id));
    }

    return `Order created successfully with id ${savedOrder.id}`;
  }
}
