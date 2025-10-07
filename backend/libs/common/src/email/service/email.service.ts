import { MailerService } from '@nestjs-modules/mailer';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common/constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, tokenId: string) {
    const url = `${process.env.VERIFY_EMAIL_URL}/${tokenId}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Amazon! Please confirm your Email',
        template: 'verify-email',
        context: {
          url,
        },
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new RpcException(ErrorCode.EMAIL_SEND_FAILED);
    }
  }
}
