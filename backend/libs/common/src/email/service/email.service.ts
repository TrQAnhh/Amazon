import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {RpcException} from "@nestjs/microservices";
import {ErrorCode} from "@app/common/constants";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string,firstName: string, lastName: string, tokenId: string) {
    const url = `${process.env.VERIFY_EMAIL_URL}?tokenId=${tokenId}&email=${encodeURIComponent(email)}`;

    try {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to Amazon! Please confirm your Email',
            template: 'verify-email',
            context: {
                firstName,
                lastName,
                url,
            },
        });
    } catch (error) {
        console.error('[EMAIL ERROR]', error);
        throw new RpcException(ErrorCode.EMAIL_SEND_FAILED);
    }
  }
}
