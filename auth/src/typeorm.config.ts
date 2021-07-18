import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './modules/user/entities/user.schema';

type DatabaseOptions = Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions;
@Injectable()
export default class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  config(item: string) {
    return this.configService.get(item);
  }

  createTypeOrmOptions(connectionName?: string): DatabaseOptions {
    return {
      type: this.config('DATABASE_TYPE'),
      host: this.config('DATABASE_HOST'),
      port: parseInt(this.config('DATABASE_PORT')),
      username: this.config('DATABASE_USERNAME'),
      password: this.config('DATABASE_PASSWORD'),
      database: this.config('DATABASE_NAME'),
      entities: [User],
      synchronize: true,
    };
  }
}
