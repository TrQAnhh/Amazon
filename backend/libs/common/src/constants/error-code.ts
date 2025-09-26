import { HttpStatus } from '@nestjs/common';

export class ErrorCode {
  static readonly INVALID_INPUT_VALUE = new ErrorCode(400, 'Invalid input value', HttpStatus.BAD_REQUEST);
  static readonly NO_FILE_PROVIDED = new ErrorCode(400, 'No file provided', HttpStatus.BAD_REQUEST);
  static readonly ITEM_OUT_OF_STOCK = new ErrorCode(400, 'Product is out of stock', HttpStatus.BAD_REQUEST);
  static readonly INVALID_CREDENTIALS = new ErrorCode(401, 'Invalid email or password', HttpStatus.UNAUTHORIZED);
  static readonly UNAUTHENTICATED = new ErrorCode(401, 'Unauthenticated access', HttpStatus.UNAUTHORIZED);
  static readonly UNAUTHORIZED = new ErrorCode(403, 'Unauthorized access', HttpStatus.FORBIDDEN);
  static readonly USER_NOT_FOUND = new ErrorCode(404, 'User not found', HttpStatus.NOT_FOUND);
  static readonly PROFILE_NOT_FOUND = new ErrorCode(404, "User's profile not found", HttpStatus.NOT_FOUND);
  static readonly PRODUCT_NOT_FOUND = new ErrorCode(404, 'Product with given information does not exis', HttpStatus.NOT_FOUND);
  static readonly ORDER_NOT_FOUND = new ErrorCode(404, 'Order with given information does not exis', HttpStatus.NOT_FOUND);
  static readonly INVALID_JWT_TOKEN = new ErrorCode(401, 'Invalid or expired JWT token', HttpStatus.UNAUTHORIZED);
  static readonly ORDER_PROCESSING = new ErrorCode(409, 'Order is currently being processed for payment', HttpStatus.CONFLICT);
  static readonly ORDER_ALREADY_PAID = new ErrorCode(409, 'Order has already been paid', HttpStatus.CONFLICT);
  static readonly EMAIL_EXISTED = new ErrorCode(409, 'Email has already been registered', HttpStatus.CONFLICT);
  static readonly USER_PROFILE_EXISTED = new ErrorCode(409, 'User profile already exists', HttpStatus.CONFLICT);
  static readonly PRODUCT_EXISTED = new ErrorCode(409, 'Product with this SKU already exists', HttpStatus.CONFLICT);
  static readonly REDIS_COMMAND_ERROR = new ErrorCode(500, 'Redis command execution error', HttpStatus.INTERNAL_SERVER_ERROR);
  static readonly CLOUDINARY_NO_RESULT = new ErrorCode(500, 'No result returned from Cloudinary', HttpStatus.INTERNAL_SERVER_ERROR);
  static readonly UNCATEGORIZED = new ErrorCode(500, 'Uncategorized error', HttpStatus.INTERNAL_SERVER_ERROR);
  static readonly PROFILE_SERVICE_UNAVAILABLE = new ErrorCode(503, 'Failed to call Profile Service', HttpStatus.SERVICE_UNAVAILABLE);
  static readonly IDENTITY_SERVICE_UNAVAILABLE = new ErrorCode(503, 'Failed to call Identity Service', HttpStatus.SERVICE_UNAVAILABLE);
  static readonly PRODUCT_SERVICE_UNAVAILABLE = new ErrorCode(503, 'Failed to call Product Service', HttpStatus.SERVICE_UNAVAILABLE);
  static readonly REDIS_CONNECTION_FAILED = new ErrorCode(503, 'Redis connection failed', HttpStatus.SERVICE_UNAVAILABLE);
  static readonly STRIPE_SERVICE_UNAVAILABLE = new ErrorCode(503, 'Failed to call Stripe Payment Service', HttpStatus.SERVICE_UNAVAILABLE,);

  private constructor(
    public readonly code: number,
    public readonly message: string,
    public readonly status: HttpStatus,
  ) {}
}
