"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = getUserProfile;
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const common_1 = require("../../../../libs/common/src");
async function getUserProfile(identityClient, userId) {
    try {
        return await (0, rxjs_1.firstValueFrom)(identityClient.send({ cmd: 'get_user_profile' }, { userId }));
    }
    catch (err) {
        throw new microservices_1.RpcException(common_1.ErrorCode.PROFILE_SERVICE_UNAVAILABLE);
    }
}
//# sourceMappingURL=get-profile.helper.js.map