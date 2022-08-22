import { Module } from '@nestjs/common';
import { UserModule } from '../../user/user.module';
import { mailProvider } from './mail.provider';
import { MailService } from './mail.service';

@Module({
  imports: [UserModule],
  providers: [mailProvider, MailService],
  controllers: [],
  exports: [mailProvider, MailService],
})
export class MailModule {}
