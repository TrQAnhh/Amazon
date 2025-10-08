"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const microservices_1 = require("@nestjs/microservices");
const common_2 = require("../..");
const stream_1 = require("stream");
let CloudinaryService = class CloudinaryService {
    async uploadImage(base64Buffer, filename, mimetype) {
        const buffer = Buffer.from(base64Buffer, 'base64');
        const stream = stream_1.Readable.from(buffer);
        const result = await new Promise((resolve, reject) => {
            const upload = cloudinary_1.v2.uploader.upload_stream({
                resource_type: 'image',
                public_id: filename,
                folder: 'avatars',
            }, (error, result) => {
                if (error)
                    return reject(new microservices_1.RpcException(error));
                if (!result)
                    return reject(new microservices_1.RpcException(common_2.ErrorCode.CLOUDINARY_NO_RESULT));
                resolve(result);
            });
            stream.pipe(upload);
        });
        return result.secure_url;
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)()
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map