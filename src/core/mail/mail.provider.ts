import * as nodemailer from 'nodemailer';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MAIL_CLIENT } from './mail.constants';

const mailFactory = async (
  configService: ConfigService,
): Promise<nodemailer.Transporter<SMTPTransport.SentMessageInfo>> => {
  const { mail, mailPassword, mailPort, mailHost } = configService.get('mail');

  const nodemailerOptions = {
    host: mailHost,
    port: +mailPort,
    auth: {
      user: mail,
      pass: mailPassword,
    },
  };

  return nodemailer.createTransport(nodemailerOptions);
};

export const mailProvider: Provider = {
  useFactory: mailFactory,
  inject: [ConfigService],
  provide: MAIL_CLIENT,
};
