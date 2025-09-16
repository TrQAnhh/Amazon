import { OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AppException } from '../../exception/app.exception';

export abstract class BaseController {
  protected constructor(protected readonly client: ClientProxy) {}

  protected async sendCommand<T>(pattern: any, payload: unknown): Promise<T> {
    try {
      const response = await firstValueFrom(this.client.send<T>(pattern, payload));
      return response;
    } catch (error) {
      console.error(`[ERROR] `, error);
      throw new AppException(error);
    }
  }
}
