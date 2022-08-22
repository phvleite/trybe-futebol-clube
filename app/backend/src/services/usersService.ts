import User from '../database/models/user';
import { IUserService } from '../interfaces/IUserService';

export default class UserService implements IUserService {
  private users: User[];

  async list(): Promise<User[]> {
    this.users = await User.findAll();
    return this.users;
  }
}

// const userService = {
//   list: async (): Promise<User[]> => {
//     const users: User[] = await User.findAll();
//     return users;
//   },
// };
