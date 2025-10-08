"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
const common_1 = require("@nestjs/common");
class ErrorCode {
    code;
    message;
    status;
    static INVALID_INPUT_VALUE = new ErrorCode(400, 'Invalid input value', common_1.HttpStatus.BAD_REQUEST);
    static NO_FILE_PROVIDED = new ErrorCode(400, 'No file provided', common_1.HttpStatus.BAD_REQUEST);
    static ITEM_OUT_OF_STOCK = new ErrorCode(400, 'Product is out of stock', common_1.HttpStatus.BAD_REQUEST);
    static EMAIL_NOT_VERIFIED = new ErrorCode(400, 'Email has not been verified. Please check your inbox to verify your account', common_1.HttpStatus.BAD_REQUEST);
    static MIN_ORDER_AMOUNT_NOT_REACHED = new ErrorCode(400, 'Order amount does not meet the minimum requirement for this discount', common_1.HttpStatus.BAD_REQUEST);
    static ORDER_ALREADY_FAILED = new ErrorCode(400, 'Order has already been marked as failed', common_1.HttpStatus.BAD_REQUEST);
    static ORDER_ALREADY_CANCELED = new ErrorCode(400, 'Order has already been canceled', common_1.HttpStatus.BAD_REQUEST);
    static TICKET_ALREADY_COLLECTED = new ErrorCode(400, 'This ticket has already been collected', common_1.HttpStatus.BAD_REQUEST);
    static INVALID_CREDENTIALS = new ErrorCode(401, 'Invalid email or password', common_1.HttpStatus.UNAUTHORIZED);
    static UNAUTHENTICATED = new ErrorCode(401, 'Unauthenticated access', common_1.HttpStatus.UNAUTHORIZED);
    static UNAUTHORIZED = new ErrorCode(403, 'Unauthorized access', common_1.HttpStatus.FORBIDDEN);
    static USER_NOT_FOUND = new ErrorCode(404, 'User not found', common_1.HttpStatus.NOT_FOUND);
    static PROFILE_NOT_FOUND = new ErrorCode(404, "User's profile not found", common_1.HttpStatus.NOT_FOUND);
    static PRODUCT_NOT_FOUND = new ErrorCode(404, 'Product with given information does not exist', common_1.HttpStatus.NOT_FOUND);
    static ORDER_NOT_FOUND = new ErrorCode(404, 'Order with given information does not exist', common_1.HttpStatus.NOT_FOUND);
    static TICKET_NOT_FOUND = new ErrorCode(404, 'Ticket not found or already used', common_1.HttpStatus.NOT_FOUND);
    static INVALID_VERIFICATION_TOKEN = new ErrorCode(401, 'Invalid or expired verification token', common_1.HttpStatus.UNAUTHORIZED);
    static INVALID_JWT_TOKEN = new ErrorCode(401, 'Invalid or expired JWT token', common_1.HttpStatus.UNAUTHORIZED);
    static ORDER_PROCESSING = new ErrorCode(409, 'Order is currently being processed for payment', common_1.HttpStatus.CONFLICT);
    static ORDER_ALREADY_PAID = new ErrorCode(409, 'Order has already been paid', common_1.HttpStatus.CONFLICT);
    static EMAIL_EXISTED = new ErrorCode(409, 'Email has already been registered', common_1.HttpStatus.CONFLICT);
    static USER_PROFILE_EXISTED = new ErrorCode(409, 'User profile already exists', common_1.HttpStatus.CONFLICT);
    static PRODUCT_EXISTED = new ErrorCode(409, 'Product with this SKU already exists', common_1.HttpStatus.CONFLICT);
    static TICKET_ALREADY_EXISTED = new ErrorCode(409, 'Discount ticket with given code already exists', common_1.HttpStatus.CONFLICT);
    static TOO_MANY_REQUESTS = new ErrorCode(429, 'Too many requests, please try again later', common_1.HttpStatus.TOO_MANY_REQUESTS);
    static REDIS_COMMAND_ERROR = new ErrorCode(500, 'Redis command execution error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    static CLOUDINARY_NO_RESULT = new ErrorCode(500, 'No result returned from Cloudinary', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    static EMAIL_SEND_FAILED = new ErrorCode(500, 'Failed to send email', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    static UNCATEGORIZED = new ErrorCode(500, 'Uncategorized error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    static PROFILE_SERVICE_UNAVAILABLE = new ErrorCode(503, 'Failed to call Profile Service', common_1.HttpStatus.SERVICE_UNAVAILABLE);
    static IDENTITY_SERVICE_UNAVAILABLE = new ErrorCode(503, 'Failed to call Identity Service', common_1.HttpStatus.SERVICE_UNAVAILABLE);
    static PRODUCT_SERVICE_UNAVAILABLE = new ErrorCode(503, 'Failed to call Product Service', common_1.HttpStatus.SERVICE_UNAVAILABLE);
    static REDIS_CONNECTION_FAILED = new ErrorCode(503, 'Redis connection failed', common_1.HttpStatus.SERVICE_UNAVAILABLE);
    static STRIPE_SERVICE_UNAVAILABLE = new ErrorCode(503, 'Failed to call Stripe Payment Service', common_1.HttpStatus.SERVICE_UNAVAILABLE);
    static RESOURCE_BUSY = new ErrorCode(503, 'Resource busy, please try again later', common_1.HttpStatus.SERVICE_UNAVAILABLE);
    constructor(code, message, status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
exports.ErrorCode = ErrorCode;
//# sourceMappingURL=error-code.js.map