import { DefaultUserDto } from './DefaultUserDto';
import { User } from '../entities/user.schema';

export function toUserDto(data: User): DefaultUserDto {
  const { id, username, email, firstName, lastName, registerDate, isActive } =
    data;
  const userDto: DefaultUserDto = {
    id,
    username,
    email,
    firstName,
    lastName,
    registerDate,
    isActive,
  };
  return userDto;
}
