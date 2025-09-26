import { ErrorCode, PaymentMethod, RepositoryService, SERVICE_NAMES } from '@app/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { getOrderProducts } from '../../helpers/get-order-products.helper';
import { OrderItemEntity } from '../../entity/order-items.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CheckOutCommand } from "../check-out/check-out.command";
import { CreateOrderCommand } from './create-order.command';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from "rxjs";

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(SERVICE_NAMES.PRODUCT)
    private readonly productClient: ClientProxy,
    private readonly commandBus: CommandBus,
    private readonly repository: RepositoryService,
  ) {}

  async execute(command: CreateOrderCommand): Promise<string | null> {
    const { role, userId, createOrderDto } = command;

    const order = this.repository.order.create({
      userId,
      paymentMethod: createOrderDto.paymentMethod,
      totalAmount: 0,
    });

    const orderItems = await getOrderProducts(this.productClient,
        createOrderDto.items.map((item) => {
            return item.productId;
        })
    );

    const products = new Map(orderItems.map((product) => {
        return [product.id, product];
    }));

    let totalAmount = 0;
    const orderItemEntities: OrderItemEntity[] = [];
    const updateStockItems: { productId: number; newStock: number }[] = [];

    for (const item of createOrderDto.items) {
      const product = products.get(item.productId);

      if (!product) {
          throw new RpcException(ErrorCode.PRODUCT_NOT_FOUND);
      }

      if (item.quantity > product.availableStock) {
          throw new RpcException(ErrorCode.ITEM_OUT_OF_STOCK);
      }

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

    order.totalAmount = totalAmount;
    order.items = orderItemEntities;
    const savedOrder = await this.repository.order.save(order);

    try {
      await firstValueFrom(this.productClient.send({ cmd: 'update_stock' }, { items: updateStockItems }));
    } catch (err) {
      throw new RpcException(err);
    }

    if (createOrderDto.paymentMethod === PaymentMethod.STRIPE) {
        return await this.commandBus.execute(new CheckOutCommand(role, userId, savedOrder.id));
    }

    return null;
  }
}
