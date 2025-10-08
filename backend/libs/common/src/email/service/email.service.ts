import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, tokenId: string) {
    const url = `${process.env.VERIFY_EMAIL_URL}/${tokenId}`;

    await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Amazon! Please confirm your Email',
        template: 'verify-email',
        context: {
          url,
        },
    });
  }
}
