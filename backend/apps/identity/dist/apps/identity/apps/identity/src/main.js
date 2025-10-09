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
const core_1 = require("@nestjs/core");
const identity_module_1 = require("./identity.module");
const microservices_1 = require("@nestjs/microservices");
const dotenv = __importStar(require("dotenv"));
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('Blog');
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(identity_module_1.IdentityModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            port: Number(process.env.IDENTITY_SERVICE_PORT),
            host: '0.0.0.0',
        },
    });
    await app.listen();
    logger.log(`TCP Microservice of Identity Service is now running on port ${process.env.IDENTITY_SERVICE_PORT}.`);
}
bootstrap();
//# sourceMappingURL=main.js.map