import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.schema';
import { ConfigModule } from '@nestjs/config';
import TypeOrmConfig from './typeorm.config';
import UserModule from './modules/user/user.module';
import CryptoModule from './modules/crypto/crypto.module';
import AuthModule from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UserModule,
    CryptoModule,
    AuthModule,
  ],
  controllers: [],
  providers: [TypeOrmConfig],
})
export class AppModule {}
