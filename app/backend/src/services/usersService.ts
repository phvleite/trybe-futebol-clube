import User from '../database/models/user';
import { IUserService } from '../interfaces/IUserService';
import passwordService from './passwordService';

export default class UserService implements IUserService {
  private users: User[];
  private result: User | null;
  private comp: boolean;

  async list(): Promise<User[]> {
    this.users = await User.findAll();
    return this.users;
  }

  async checkIfExistEmail(email: string, password: string): Promise<User> {
    this.result = await User.findOne({ where: { email } });

    if (this.result) this.comp = passwordService.comparePassword(password, this.result.password);

    if (!this.result || !this.comp) {
      const error = new Error();
      error.name = 'UnauthorizedError';
      error.message = 'Incorrect email ou password';
      throw error;
    }

    return this.result;
  }
}
