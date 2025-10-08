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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityModule = void 0;
const get_user_identities_handler_1 = require("./queries/get-user-identities/get-user-identities.handler");
const get_user_identity_handler_1 = require("./queries/get-user-identity/get-user-identity.handler");
const validate_token_handler_1 = require("./queries/validate-token/validate-token.handler");
const refresh_token_handler_1 = require("./commands/refresh-token/refresh-token.handler");
const verify_email_handler_1 = require("./queries/verify-email/verify-email.handler");
const identity_exception_filter_1 = require("./exception/identity-exception.filter");
const user_registered_handler_1 = require("./event/user-registered.handler");
const identity_controller_1 = require("./controller/identity.controller");
const sign_out_handler_1 = require("./commands/sign-out/sign-out.handler");
const common_1 = require("../../../libs/common/src");
const sign_up_handler_1 = require("./commands/sign-up/sign-up.handler");
const sign_in_handler_1 = require("./commands/sign-in/sign-in.handler");
const microservices_1 = require("@nestjs/microservices");
const repository_module_1 = require("../../repository/repository.module");
const typeorm_config_1 = require("./config/typeorm.config");
const email_module_1 = require("../../../libs/common/src/email/email.module");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const common_2 = require("@nestjs/common");
const dotenv = __importStar(require("dotenv"));
const process = __importStar(require("node:process"));
dotenv.config();
let IdentityModule = class IdentityModule {
};
exports.IdentityModule = IdentityModule;
exports.IdentityModule = IdentityModule = __decorate([
    (0, common_2.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync(typeorm_config_1.typeOrmConfigAsync),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET_KEY,
                signOptions: {
                    expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION,
                },
            }),
            microservices_1.ClientsModule.register([
                {
                    name: common_1.SERVICE_NAMES.PROFILE,
                    transport: microservices_1.Transport.TCP,
                    options: {
                        host: process.env.PROFILE_SERVICE_HOST,
                        port: Number(process.env.PROFILE_SERVICE_PORT),
                    },
                },
            ]),
            common_1.RedisModule.register({
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
                accessKey: process.env.REDIS_ACCESS_KEY,
            }),
            repository_module_1.RepositoryModule,
            email_module_1.EmailModule,
            cqrs_1.CqrsModule,
        ],
        controllers: [identity_controller_1.IdentityController],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: identity_exception_filter_1.IdentityExceptionFilter,
            },
            get_user_identity_handler_1.GetUserIdentityHandler,
            get_user_identities_handler_1.GetUserIdentitiesHandler,
            sign_up_handler_1.SignUpHandler,
            sign_in_handler_1.SignInHandler,
            sign_out_handler_1.SignOutHandler,
            validate_token_handler_1.ValidateTokenHandler,
            refresh_token_handler_1.RefreshTokenHandler,
            user_registered_handler_1.UserRegisteredHandler,
            verify_email_handler_1.VerifyEmailHandler,
        ],
    })
], IdentityModule);
//# sourceMappingURL=identity.module.js.map