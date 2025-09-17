import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export abstract class BaseController {
  protected constructor(protected readonly client: ClientProxy) {}

  protected async sendCommand<T>(pattern: any, payload?: unknown): Promise<T> {
    try {

      const safePayload = payload || {};

      const response = await firstValueFrom(this.client.send<T>(pattern, safePayload));

      return response;

    } catch (error) {
      console.error(`[ERROR] `, error);
      throw error;
    }
  }
}
