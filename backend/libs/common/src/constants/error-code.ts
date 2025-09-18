import { HttpStatus } from '@nestjs/common';

export class ErrorCode {
  static readonly INVALID_INPUT_VALUE = new ErrorCode(400, 'Invalid input value', HttpStatus.BAD_REQUEST);
  static readonly INVALID_CREDENTIALS = new ErrorCode(401, 'Invalid email or password', HttpStatus.UNAUTHORIZED);
  static readonly UNAUTHENTICATED = new ErrorCode(401, 'Unauthenticated access', HttpStatus.UNAUTHORIZED);
  static readonly UNAUTHORIZED = new ErrorCode(403, 'Unauthorized access', HttpStatus.FORBIDDEN);
  static readonly USER_NOT_FOUND = new ErrorCode(404, 'User not found', HttpStatus.NOT_FOUND);
  static readonly PROFILE_NOT_FOUND = new ErrorCode(404, "User's profile not found", HttpStatus.NOT_FOUND);
  static readonly INVALID_JWT_TOKEN = new ErrorCode(401, 'Invalid or expired JWT token', HttpStatus.UNAUTHORIZED);
  static readonly EMAIL_EXISTED = new ErrorCode(409, 'Email has already been registered', HttpStatus.CONFLICT);
  static readonly USER_PROFILE_EXISTED = new ErrorCode(409, 'User profile already exists', HttpStatus.CONFLICT);
  static readonly CLOUDINARY_NO_RESULT = new ErrorCode(500, 'No result returned from Cloudinary', HttpStatus.INTERNAL_SERVER_ERROR);
  static readonly UNCATEGORIZED = new ErrorCode(500, 'Uncategorized error', HttpStatus.INTERNAL_SERVER_ERROR);
  static readonly IDENTITY_SERVICE_UNAVAILABLE = new ErrorCode(503, 'Failed to call Identity Service', HttpStatus.SERVICE_UNAVAILABLE,);

  private constructor(
    public readonly code: number,
    public readonly message: string,
    public readonly status: HttpStatus,
  ) {}
}
