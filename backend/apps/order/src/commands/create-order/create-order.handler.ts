import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { OrderEntity } from '../../entity/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItemEntity } from '../../entity/order-items.entity';
import { getProducts } from '../../helpers/get-products.helper';
import { ErrorCode, SERVICE_NAMES } from '@app/common';
import { ProductEntity } from '../../../../product/src/entity/product.entity';
import { Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

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

    const order = this.orderRepo.create({
      userId,
      paymentMethod: createOrderDto.paymentMethod,
      totalAmount: 0,
    });

    const productIds = createOrderDto.items.map((item) => item.productId);

    const items = await getProducts(this.productClient, productIds);

    const totalAmount = createOrderDto.items.reduce((sum, item) => {
      const product = items.find((p) => p.id === item.productId);
      if (!product) {
        throw new RpcException(ErrorCode.PRODUCT_NOT_FOUND);
      }
      return sum + product.price * item.quantity;
    }, 0);

    order.totalAmount = totalAmount;

    const savedOrder = await this.orderRepo.save(order);

    const orderItems = createOrderDto.items.map((item) => {
      const product = items.find((p) => p.id === item.productId);

      if (!product) {
        throw new RpcException(ErrorCode.PRODUCT_NOT_FOUND);
      }
      return this.orderItemRepo.create({
        order: savedOrder,
        productId: product.id,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity,
      });
    });

    await this.orderItemRepo.save(orderItems);

    return 'Create order successfully!';
  }
}
