import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { OrderEntity } from '../../entity/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItemEntity } from '../../entity/order-items.entity';
import { getOrderProducts } from '../../helpers/get-order-products.helper';
import { ErrorCode, SERVICE_NAMES } from '@app/common';
import { Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {firstValueFrom} from "rxjs";

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,
    @Inject(SERVICE_NAMES.PRODUCT)
    private readonly productClient: ClientProxy,
  ) {}

  async execute(command: CreateOrderCommand): Promise<string> {
    const { userId, createOrderDto } = command;

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
        this.orderItemRepo.create({
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

    const order = this.orderRepo.create({
      userId,
      paymentMethod: createOrderDto.paymentMethod,
      totalAmount,
      items: orderItemEntities,
    });

    await this.orderRepo.save(order);

    try {
      await firstValueFrom(this.productClient.send({ cmd: 'update_stock' }, { items: updateStockItems }));
    } catch (err) {
      throw new RpcException(err);
    }

    return 'Create new order successfully!';
  }
}
