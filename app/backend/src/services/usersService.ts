import User from '../database/models/user';
import { IUserService } from '../interfaces/IUserService';
import passwordService from './passwordService';
import JwtService from './jwtService';

interface Payload {
  role: string,
  email: string,
}

export default class UserService implements IUserService {
  // private users: User[];
  private result: User | null;
  private comp: boolean;

  // async list(): Promise<User[]> {
  //   this.users = await User.findAll();
  //   return this.users;
  // }

  async checkIfExistEmail(email: string, password: string): Promise<object> {
    this.result = await User.findOne({ where: { email } });

    if (this.result) this.comp = passwordService.comparePassword(password, this.result.password);

    if (!this.result || !this.comp) {
      const error = new Error();
      error.name = 'UnauthorizedError';
      error.message = 'Incorrect email or password';
      throw error;
    }

    const payload: Payload = {
      role: this.result.role,
      email: this.result.email,
    };

    const token = JwtService.sign(payload);

    return { token };
  }
}
