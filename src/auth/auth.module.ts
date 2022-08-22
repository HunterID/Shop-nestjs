import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from './token/token.module';
import { AuthCacheService } from './auth-cache.service';
import { GoogleAuthModule } from './google/google.module';
import { MailModule } from '../core/mail/mail.module';

@Global()
@Module({
  imports: [UserModule, TokenModule, GoogleAuthModule, MailModule],
  providers: [AuthService, AuthCacheService],
  exports: [TokenModule, AuthCacheService],
  controllers: [AuthController],
})
export class AuthModule {}
