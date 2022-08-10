import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../core/redis/redis.service';
import { USER_TOKEN } from './auth.constants';

@Injectable()
export class AuthCacheService {
  tokenExpirationTime: number;

  constructor(private readonly redisService: RedisService, private readonly configService: ConfigService) {
    this.tokenExpirationTime = this.configService.get('jwt.refreshTokenExpirationTime');
  }

  public async saveAccessTokenToRedis(userId: string, accessToken: string): Promise<void> {
    const multi = await this.redisService.multi();

    await this.redisService.sAdd(`${USER_TOKEN}:${userId}`, accessToken, multi);
    await this.redisService.expire(`${USER_TOKEN}:${userId}`, this.tokenExpirationTime, multi);

    await this.redisService.exec(multi);
  }

  public async removeAccessTokenFromRedis(userId: string, accessToken: string): Promise<void> {
    await this.redisService.sRem(`${USER_TOKEN}:${userId}`, accessToken);
  }

  public async isAccessTokenExist(userId: string, accessToken: string): Promise<boolean> {
    const userAccessTokens = await this.redisService.sMembers(`${USER_TOKEN}:${userId}`);

    return userAccessTokens.some((token: string) => token === accessToken);
  }
}
