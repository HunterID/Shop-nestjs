import { promises as fs } from 'fs';
import handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAIL_CLIENT, MAIL_SUBJECT, PATH_TO_HBS } from './mail.constants';

@Injectable()
export class MailService {
  private readonly mailSender: string;

  constructor(
    @Inject(MAIL_CLIENT) private readonly mailClient: nodemailer.Transporter,
    private readonly configService: ConfigService,
  ) {
    this.mailSender = this.configService.get('mail').mailSender;
  }

  public async sendVerificationMail(userMail: string, code: string): Promise<void> {
    const htmlToSend = await this.handlebarsHTML(userMail, code);
    const mailOptions = this.getMailOptions(userMail, htmlToSend);

    await this.mailClient.sendMail(mailOptions);
  }

  private async handlebarsHTML(userEmail: string, code: string): Promise<string> {
    const mailTemplateSource = await fs.readFile(PATH_TO_HBS, 'utf-8');
    const template = handlebars.compile(mailTemplateSource);

    return template({ userEmail: `${userEmail}`, code: `${code}` });
  }

  private getMailOptions(userMail: string, htmlToSend: string): nodemailer.SendMailOptions {
    const mailOptions = {
      from: `${this.mailSender}`,
      to: `${userMail}`,
      subject: MAIL_SUBJECT,
      html: htmlToSend,
    };

    return mailOptions;
  }
}
