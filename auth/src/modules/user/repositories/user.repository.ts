import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/user.schema';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
