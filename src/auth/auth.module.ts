import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from './token/token.module';
import { AuthCacheService } from './auth-cache.service';

@Global()
@Module({
  imports: [UserModule, TokenModule],
  providers: [AuthService, AuthCacheService],
  exports: [TokenModule, AuthCacheService],
  controllers: [AuthController],
})
export class AuthModule {}
