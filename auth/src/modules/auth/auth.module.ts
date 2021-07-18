import { Module } from '@nestjs/common';
import UserModule from '../user/user.module';
import JwtStrategy from './strategies/jwt.strategy';
import AuthService from './services/auth.service';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import JwtGuard from './guards/jwt.guard';
import LocalGuard from './guards/local.guard';
import AuthController from './controllers/auth.controller';
import RoleGuard from './guards/role.guard';
import RoleService from './services/role.service';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRETKEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRESIN') },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    JwtStrategy,
    JwtGuard,
    LocalGuard,
    RoleGuard,
    RoleService,
  ],
  exports: [PassportModule, JwtModule],
})
export default class AuthModule {}
