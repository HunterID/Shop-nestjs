import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TokenModule } from '../auth/token/token.module';
import { UserModule } from '../user/user.module';
import { MulterController } from './multer.controller';
import { S3Provider } from './multer.provider';
import { MulterStorageService } from './multerStorage';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [MulterUploadModule],
      inject: [MulterStorageService],
      useFactory: (multerStorageService: MulterStorageService) => {
        return { storage: multerStorageService };
      },
    }),
    TokenModule,
    UserModule,
  ],
  controllers: [MulterController],
  providers: [S3Provider, MulterStorageService],
  exports: [S3Provider, MulterStorageService],
})
export class MulterUploadModule {}
