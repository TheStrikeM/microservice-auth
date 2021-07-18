import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import AuthService from '../services/auth.service';
import JwtGuard from '../guards/jwt.guard';
import { UserRole } from '../../user/interfaces/UserRoleInterface';
import RolesGuard from '../guards/role.guard';
import { hasRoles } from '../decorators/role.decorator';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto) {
    return this.authService.login(dto);
  }

  @Post('reg')
  register(@Body() dto) {
    return this.authService.register(dto);
  }

  @UseGuards(JwtGuard)
  @Get('success')
  getSuccess(@Request() req) {
    console.log(req.user);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @hasRoles(UserRole.USER)
  @Get('success-role')
  getSuccessRole(@Request() req) {
    console.log(req.user);
  }
}
