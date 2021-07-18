import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DefaultUserDto } from '../dto/DefaultUserDto';
import { User } from '../entities/user.schema';
import { toUserDto } from '../dto/toUserDto';
import { LoginUserDto } from '../dto/LoginUserDto';
import { RegisterUserDto } from '../dto/RegisterUserDto';
import CryptoService from '../../crypto/crypto.service';

@Injectable()
export default class UserService {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async findOneMan(options?: object): Promise<DefaultUserDto> {
    const user: User = await this.userRepo.findOne(options);
    return user;
  }

  async findByLogin({
    username,
    password,
  }: LoginUserDto): Promise<DefaultUserDto> {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user)
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);

    const isValidPassword = this.cryptoService.comparePassword(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    return toUserDto(user);
  }

  async findByPayload({ username }: any): Promise<DefaultUserDto> {
    return await this.userRepo.findOne({ where: { username } });
  }

  async createUser(userDto: RegisterUserDto): Promise<DefaultUserDto> {
    const { username, email, password, firstName, lastName } = userDto;
    const isExistUser = await this.userRepo.findOne({ where: { username } });
    if (isExistUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const nowDate = new Date();
    const encryptedPassword = this.cryptoService.encrypt(password);

    this.logger.log(`User success created, info: ${username} ${email}`);
    this.logger.log(`${username}: ${encryptedPassword}`);

    const newUser: User = this.userRepo.create({
      username,
      email,
      password: encryptedPassword,
      firstName,
      lastName,
      registerDate: nowDate,
    });
    await this.userRepo.save(newUser);
    return toUserDto(newUser);
  }
}
