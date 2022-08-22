import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './auth/token/token.module';
import { CoreModule } from './core/core.module';
import { MulterUploadModule } from './multer/multer.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CoreModule, UserModule, AuthModule, TokenModule, MulterUploadModule],
})
export class AppModule {}
