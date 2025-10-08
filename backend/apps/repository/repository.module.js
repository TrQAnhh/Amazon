"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var identity_entity_1 = require("../identity/src/entity/identity.entity");
var product_entity_1 = require("../product/src/entity/product.entity");
var profile_identity_1 = require("../profile/src/entity/profile.identity");
var identity_repository_1 = require("./identity.repository");
var profile_repository_1 = require("./profile.repository");
var repository_service_1 = require("./repository.service");
var product_repository_1 = require("./product.repository");
var order_entity_1 = require("../order/src/entity/order.entity");
var order_items_entity_1 = require("../order/src/entity/order-items.entity");
var order_item_repository_1 = require("./order-item.repository");
var order_repository_1 = require("./order.repository");
var discount_ticket_entity_1 = require("../order/src/entity/discount-ticket.entity");
var user_ticket_entity_1 = require("../order/src/entity/user-ticket.entity");
var discount_ticket_repository_1 = require("@repository/discount-ticket.repository");
var user_ticket_repository_1 = require("@repository/user-ticket.repository");
var order_ticket_repository_1 = require("@repository/order-ticket.repository");
var order_ticket_entity_1 = require("../order/src/entity/order-ticket.entity");
var RepositoryModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([
                    identity_entity_1.IdentityEntity,
                    profile_identity_1.ProfileEntity,
                    product_entity_1.ProductEntity,
                    order_entity_1.OrderEntity,
                    order_items_entity_1.OrderItemEntity,
                    discount_ticket_entity_1.DiscountTicketEntity,
                    user_ticket_entity_1.UserTicketEntity,
                    order_ticket_entity_1.OrderTicketEntity,
                ]),
            ],
            providers: [
                repository_service_1.RepositoryService,
                identity_repository_1.IdentityRepository,
                profile_repository_1.ProfileRepository,
                product_repository_1.ProductRepository,
                order_repository_1.OrderRepository,
                order_item_repository_1.OrderItemRepository,
                discount_ticket_repository_1.DiscountTicketRepository,
                user_ticket_repository_1.UserTicketRepository,
                order_ticket_repository_1.OrderTicketRepository,
            ],
            exports: [repository_service_1.RepositoryService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RepositoryModule = _classThis = /** @class */ (function () {
        function RepositoryModule_1() {
        }
        return RepositoryModule_1;
    }());
    __setFunctionName(_classThis, "RepositoryModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RepositoryModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RepositoryModule = _classThis;
}();
exports.RepositoryModule = RepositoryModule;
