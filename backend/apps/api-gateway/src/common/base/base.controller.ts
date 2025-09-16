import { OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AppException } from '../../exception/app.exception';

export abstract class BaseController implements OnModuleInit {
  protected constructor(protected readonly client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
    console.log(`[CONTROLLER] Connected to microservices`);
  }

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
