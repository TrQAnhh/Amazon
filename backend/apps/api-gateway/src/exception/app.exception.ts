import { HttpException } from '@nestjs/common';
import { ErrorCode } from '@app/common';

export class AppException extends HttpException {
  constructor(error: ErrorCode) {
    super(
      {
        code: error.code,
        message: error.message,
        status: error.status,
      },
      error.status,
    );
  }
}
