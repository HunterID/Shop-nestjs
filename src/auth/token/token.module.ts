import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/models/user.model';
import { AuthCacheService } from '../auth-cache.service';
import { RefreshToken } from './model/refreshToken.model';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get('jwt.accessTokenExpirationTime'),
        },
        secret: configService.get('jwt.accessTokenSecret'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenService, AuthCacheService],
  controllers: [TokenController],
  exports: [TokenService],
})
export class TokenModule {}
