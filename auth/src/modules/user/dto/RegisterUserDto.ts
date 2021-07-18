import { LoginUserDto } from './LoginUserDto';

export interface RegisterUserDto extends LoginUserDto {
  email: string;
  firstName: string;
  lastName: string;
  registerDate: Date;
}
