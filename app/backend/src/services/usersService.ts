import User from '../database/models/user';
import { IUserService } from '../interfaces/IUserService';
import passwordService from './passwordService';

export default class UserService implements IUserService {
  private users: User[];
  private result: User | null;

  async list(): Promise<User[]> {
    this.users = await User.findAll();
    return this.users;
  }

  async checkIfExistEmail(email: string, password: string): Promise<User> {
    this.result = await User.findOne({ where: { email } });

    if (!this.result) {
      const error = new Error();
      error.name = 'UnauthorizedError';
      error.message = 'Incorrect email ou password';
      throw error;
    }

    // const encryptedPassword = passwordService.encryptPassword(password);
    const comp = passwordService.comparePassword(password, this.result.password);
    console.log(comp);
    return this.result;
  }
}
