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
exports.CreateTicketDto = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("../../..");
const swagger_1 = require("@nestjs/swagger");
class CreateTicketDto {
    code;
    type;
    value;
    minOrderAmount;
    maxDiscount;
    startDate;
    endDate;
    total;
    usageLimit;
}
exports.CreateTicketDto = CreateTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: common_1.DiscountType }),
    (0, class_validator_1.IsEnum)(common_1.DiscountType),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'number', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'number', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "minOrderAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'number', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "maxDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'number' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'number' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "usageLimit", void 0);
//# sourceMappingURL=create-ticket.dto.js.map