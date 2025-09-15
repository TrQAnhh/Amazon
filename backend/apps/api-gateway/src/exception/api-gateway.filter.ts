/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ApiGatewayRpcExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    console.log('ApiGatewayRpcExceptionFilter', exception.getResponse());

    response.status(status).json({
      success: false,
      message,
      code: exception.getResponse()?.['errorCode'],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
