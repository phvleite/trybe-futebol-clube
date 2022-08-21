import User from '../database/models/user';
// import { IUserService } from '../interfaces/IUserService';

export interface IUserService {
  list(): Promise<User[]>
}

export class UserService implements IUserService {
  async list(): Promise<User[]> {
    const users: User[] = await User.findAll();
    return users;
  }
}
