import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UpdateStockCommand} from "./update-stock.command";
import {In, Repository} from "typeorm";
import {ProductEntity} from "../../entity/product.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {RpcException} from "@nestjs/microservices";
import {ErrorCode} from "@app/common";

@CommandHandler(UpdateStockCommand)
export class UpdateStockHandler implements ICommandHandler<UpdateStockCommand> {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
    ){}

    async execute(command: UpdateStockCommand): Promise<boolean> {
        const { items } = command;

        const productIds = items.map(i => i.productId);
        const products = await this.productRepo.find({
            where: { id: In(productIds) },
        });

        const productMap = new Map(products.map(p => [p.id, p]));

        for (const item of items) {
            const product = productMap.get(item.productId);
            if (!product) throw new RpcException(ErrorCode.PRODUCT_NOT_FOUND);

            product.availableStock = item.newStock;
        }

        await this.productRepo.save(Array.from(productMap.values()));

        return true;
    }
}