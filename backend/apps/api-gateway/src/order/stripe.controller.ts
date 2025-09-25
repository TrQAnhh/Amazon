import {Controller, Inject, Post, Req, Headers, HttpCode} from "@nestjs/common";
import type { RawBodyRequest } from '@nestjs/common';
import { BaseController } from "../common/base/base.controller";
import { SERVICE_NAMES } from "@app/common";
import { ClientProxy } from "@nestjs/microservices";
import { Response } from '../common/interceptors/transform/transform.interceptor';
import { Public } from "../common/decorators/public.decorator";

@Public()
@Controller('stripe')
export class StripeController extends BaseController {
    constructor(@Inject(SERVICE_NAMES.ORDER) protected client: ClientProxy) {
        super(client);
    }

    @Post('/webhook')
    @HttpCode(200)
    async webhook(
        @Headers('stripe-signature') signature: string,
        @Req() request: RawBodyRequest<Request>,
    ): Promise<Response<any>> {
        const rawBody = request.rawBody as Buffer;

        const message = await this.sendCommand<string>({ cmd: 'stripe_webhook' }, { rawBody: rawBody.toString('base64'), signature });
        return {
            message,
            success: true,
            data: null,
        }
    }

}