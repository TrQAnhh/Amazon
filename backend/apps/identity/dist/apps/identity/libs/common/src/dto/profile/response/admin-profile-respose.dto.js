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
exports.AdminProfileResponseDto = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class AdminProfileResponseDto {
    email;
    userId;
    firstName;
    middleName;
    lastName;
    address;
    avatarUrl;
    bio;
}
exports.AdminProfileResponseDto = AdminProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdminProfileResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'number' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AdminProfileResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdminProfileResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdminProfileResponseDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdminProfileResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdminProfileResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdminProfileResponseDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdminProfileResponseDto.prototype, "bio", void 0);
//# sourceMappingURL=admin-profile-respose.dto.js.map