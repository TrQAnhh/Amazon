import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppException } from './app.exception';
import { ErrorCode } from '@app/common';

@Catch(AppException)
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: AppException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const error = exception.getResponse() as any;
    const status = error.status ?? ErrorCode.UNCATEGORIZED.status;

    response.status(status).json({
      success: false,
      message: error.message ?? ErrorCode.UNCATEGORIZED.message,
      code: error.code ?? ErrorCode.UNCATEGORIZED.code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
