import { Module } from '@nestjs/common';
import { UserModule } from '../../user/user.module';
import { TokenModule } from '../token/token.module';
import { GoogleAuthController } from './google.controller';
import { googleProvider } from './google.provider';
import { GoogleAuthService } from './google.service';

@Module({
  imports: [UserModule, TokenModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, googleProvider],
  exports: [],
})
export class GoogleAuthModule {}
