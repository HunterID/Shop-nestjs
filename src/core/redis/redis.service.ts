import { Redis, Pipeline } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from '../core.constants';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  public multi(): Pipeline {
    return this.redisClient.multi();
  }

  public exec(multi: Pipeline): Promise<any[]> {
    const client = multi || this.redisClient;
    return client.exec();
  }

  public sAdd(hash: string, value: string, multi?: Pipeline): Pipeline | Promise<number> {
    const client = multi || this.redisClient;
    return client.sadd(hash, value);
  }

  public sRem(hash: string, setMember: string, multi?: Pipeline): Pipeline | Promise<number> {
    const client = multi || this.redisClient;
    return client.srem(hash, setMember);
  }

  public async sMembers(hash: string): Promise<string[]> {
    return this.redisClient.smembers(hash);
  }

  public expire(key: string, time: number, multi?: Pipeline): Pipeline | Promise<number> {
    const client = multi || this.redisClient;
    return client.expire(key, time);
  }
}
