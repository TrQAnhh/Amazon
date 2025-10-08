"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = void 0;
const constants_1 = require("../../../constants");
const swagger_1 = require("@nestjs/swagger");
class CreateOrderDto {
    paymentMethod;
    items;
    freeshipId;
    discountId;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.PaymentMethod }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                productId: { type: 'number' },
                quantity: { type: 'number' },
            },
            required: ['productId', 'quantity'],
        },
    }),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'number', required: false }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "freeshipId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'number', required: false }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "discountId", void 0);
//# sourceMappingURL=create-order.dto.js.map