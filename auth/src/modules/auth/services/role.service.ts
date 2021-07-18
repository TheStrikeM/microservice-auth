import { Injectable } from '@nestjs/common';
import { LoginUserDto } from '../../user/dto/LoginUserDto';
import UserService from '../../user/repositories/user.service';

@Injectable()
export default class RoleService {
  constructor(private readonly userRepository: UserService) {}

  validateUserWithPassword(user: LoginUserDto): boolean {
    const verifiedUser = this.userRepository.findOneMan(user);
    if (!verifiedUser) return false;
    return true;
  }

  async matchRoles(roles: string[], user: any) {
    const verifiedUser = await this.validateUserWithPassword(user);
    if (!verifiedUser) return false;

    const hasRole = roles.indexOf(user.role) > -1;
    return hasRole;
  }
}
