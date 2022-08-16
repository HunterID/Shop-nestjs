import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../../user/user.module';
import { RefreshToken } from './model/refreshToken.model';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
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
    UserModule,
  ],
  providers: [TokenService],
  controllers: [TokenController],
  exports: [TokenService],
})
export class TokenModule {}
