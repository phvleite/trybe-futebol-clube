import User from '../database/models/user';

export interface IUserService {
  list(): Promise<User[]>
}
