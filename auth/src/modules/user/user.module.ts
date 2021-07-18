import { Module } from '@nestjs/common';
import CryptoModule from '../crypto/crypto.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import UserService from "./repositories/user.service";

@Module({
  imports: [CryptoModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export default class UserModule {}
