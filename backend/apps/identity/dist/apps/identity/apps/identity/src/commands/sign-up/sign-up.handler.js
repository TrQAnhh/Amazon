"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpHandler = void 0;
const user_registered_event_1 = require("../../event/user-registered.event");
const repository_service_1 = require("../../../../repository/repository.service");
const microservices_1 = require("@nestjs/microservices");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("../../../../../libs/common/src");
const sign_up_command_1 = require("./sign-up.command");
const cqrs_2 = require("@nestjs/cqrs");
const rxjs_1 = require("rxjs");
const common_2 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
let SignUpHandler = class SignUpHandler {
    profileClient;
    repository;
    eventBus;
    constructor(profileClient, repository, eventBus) {
        this.profileClient = profileClient;
        this.repository = repository;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const { signUpDto } = command;
        const existingUser = await this.repository.identity.findByEmail(signUpDto.email);
        if (existingUser) {
            if (existingUser.isVerified) {
                throw new microservices_1.RpcException(common_1.ErrorCode.EMAIL_EXISTED);
            }
            else {
                throw new microservices_1.RpcException(common_1.ErrorCode.EMAIL_NOT_VERIFIED);
            }
        }
        const hashedPassword = await bcrypt.hash(signUpDto.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
        const user = this.repository.identity.create({
            ...signUpDto,
            password: hashedPassword,
        });
        const savedUser = await this.repository.identity.save(user);
        await (0, rxjs_1.firstValueFrom)(this.profileClient.send({ cmd: 'create_profile' }, { userId: savedUser.id, signUpDto }));
        this.eventBus.publish(new user_registered_event_1.UserRegisteredEvent(savedUser.id, savedUser.email));
        return 'Please check your email to verify your account';
    }
};
exports.SignUpHandler = SignUpHandler;
exports.SignUpHandler = SignUpHandler = __decorate([
    (0, cqrs_1.CommandHandler)(sign_up_command_1.SignUpCommand),
    __param(0, (0, common_2.Inject)(common_1.SERVICE_NAMES.PROFILE)),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        repository_service_1.RepositoryService,
        cqrs_2.EventBus])
], SignUpHandler);
//# sourceMappingURL=sign-up.handler.js.map