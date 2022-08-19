import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeOrm.config';
import configuration from '../../config/configuration';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    RedisModule,
    MailModule,
  ],
  providers: [],
  exports: [RedisModule],
})
export class CoreModule {}
