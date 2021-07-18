import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwtpayload.interface';
import { JwtService } from '@nestjs/jwt';
import { DefaultUserDto } from '../../user/dto/DefaultUserDto';
import { RegisterUserDto } from '../../user/dto/RegisterUserDto';
import { LoginUserDto } from '../../user/dto/LoginUserDto';
import { TokenStatus } from '../interfaces/status/token-status.interface';
import { RegisterStatus } from '../interfaces/status/register-status.interface';
import { LoginStatus } from '../interfaces/status/login-status.interface';
import UserService from '../../user/repositories/user.service';

@Injectable()
export default class AuthService {
  constructor(
    private readonly userRepository: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private _createToken({ username }: DefaultUserDto): TokenStatus {
    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: process.env.JWT_EXPIRESIN,
      accessToken,
    };
  }

  async getInfo({ username }) {
    return this.userRepository.findByPayload({ username });
  }

  async validateUser(payload: JwtPayload): Promise<DefaultUserDto> {
    const user = await this.userRepository.findByPayload(payload);
    if (!user)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    return user;
  }

  async register(dto: RegisterUserDto): Promise<RegisterStatus> {
    let status: RegisterStatus = {
      success: true,
      message: 'User success registered',
    };

    try {
      console.log('to repo');
      await this.userRepository.createUser(dto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(dto: LoginUserDto): Promise<LoginStatus> {
    let status: LoginStatus = {
      success: true,
      message: 'The user has successfully logged in',
    };
    try {
      const user = await this.userRepository.findByLogin(dto);
      const token = this._createToken(user);
      status.data = {
        user,
        token,
      };
    } catch (err) {
      console.log(err);
      status = {
        success: false,
        message: err,
      };
    }

    return status;
  }
}
