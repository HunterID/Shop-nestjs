import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/models/user.model';
import { UserService } from '../../user/user.service';
import { AuthCacheService } from '../auth-cache.service';
import { AUTH_VALIDATION_ERRORS } from '../auth.constants';
import { jwtTokensInterface } from '../interfaces/tokens.interfaces';
import { RefreshToken } from './model/refreshToken.model';

@Injectable()
export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessExpirationTime: number;
  private readonly refreshExpirationTime: number;

  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authCacheService: AuthCacheService,
  ) {
    this.accessTokenSecret = this.configService.get('jwt.accessTokenSecret');
    this.refreshTokenSecret = this.configService.get('jwt.refreshTokenSecret');
    this.accessExpirationTime = this.configService.get('jwt.accessTokenExpirationTime');
    this.refreshExpirationTime = this.configService.get('jwt.refreshTokenExpirationTime');
  }

  public composeAccessToken(userId: string): Promise<string> {
    const accessTokenOptions = {
      secret: this.accessTokenSecret,
      expiresIn: this.accessExpirationTime,
    };

    return this.jwtService.signAsync({ userId }, accessTokenOptions);
  }

  public composeRefreshToken(userId: string): Promise<string> {
    const refreshTokenOptions = {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshExpirationTime,
    };

    return this.jwtService.signAsync({ userId }, refreshTokenOptions);
  }

  public async composeTokens(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return {
      accessToken: await this.composeAccessToken(userId),
      refreshToken: await this.composeRefreshToken(userId),
    };
  }

  public async verifyToken(token: string): Promise<{ userId: string }> {
    const { accessTokenSecret } = this.configService.get('jwt');

    return this.jwtService.verifyAsync(token, accessTokenSecret);
  }

  public async saveRefreshToken(refreshToken: string, user: User, userAgent: string): Promise<void> {
    await this.refreshRepository.save({ refreshToken, user, userAgent });
  }

  public async updateAccessToken(refreshToken: string): Promise<{
    accessToken: string;
  }> {
    const { user } = await this.findAndVerifyToken(refreshToken);
    const { id: userId } = user;
    const accessToken = await this.composeAccessToken(userId);

    await this.authCacheService.saveAccessTokenToRedis(userId, accessToken);

    return { accessToken: accessToken };
  }

  public async updateRefreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { user } = await this.findAndVerifyToken(refreshToken);
    const { id: userId } = user;
    const tokens = await this.composeTokens(userId);

    const userEntity = await this.userService.composeUserEntity({ ...user, ...tokens });

    await Promise.all([
      this.authCacheService.saveAccessTokenToRedis(userId, userEntity.accessToken),
      this.refreshRepository.update({ user: userEntity }, { refreshToken: userEntity.refreshToken }),
    ]);

    return tokens;
  }

  private async findAndVerifyToken(refreshToken: string): Promise<RefreshToken> {
    const token = await this.refreshRepository.findOne({ where: { refreshToken }, relations: ['user'] });

    if (!token) {
      throw new BadRequestException(AUTH_VALIDATION_ERRORS.TOKEN_NOT_FOUND);
    }

    return token;
  }

  public async removeRefreshToken(refreshToken: string): Promise<void> {
    await this.refreshRepository.delete({ refreshToken });
  }

  public async saveUserTokens(user: User, tokens: jwtTokensInterface, userAgent: string): Promise<void> {
    const { accessToken, refreshToken } = tokens;

    await Promise.all([
      this.saveRefreshToken(refreshToken, user, userAgent),
      this.authCacheService.saveAccessTokenToRedis(user.id, accessToken),
    ]);
  }
}
