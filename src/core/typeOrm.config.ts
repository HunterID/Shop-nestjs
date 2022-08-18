import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TYPE_ORM_CONFIG } from './core.constants';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('postgres.host'),
      port: +this.configService.get('postgres.port'),
      username: this.configService.get('postgres.username'),
      password: this.configService.get('postgres.password'),
      database: this.configService.get('postgres.database'),
      synchronize: false,
      logging: false,
      migrationsRun: false,
      entities: [TYPE_ORM_CONFIG.PATH_TO_ENTITIES],
      migrations: [TYPE_ORM_CONFIG.PATH_TO_MIGRATIONS],
    };
  }
}
