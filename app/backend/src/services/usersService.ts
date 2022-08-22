import User from '../database/models/user';
import { IUserService } from '../interfaces/IUserService';

export default class UserService implements IUserService {
  private users: User[];
  private result: User | null;

  async list(): Promise<User[]> {
    this.users = await User.findAll();
    return this.users;
  }

  async checkIfExistEmail(email: string): Promise<User> {
    this.result = await User.findOne({ where: { email } });

    if (!this.result) {
      const error = new Error();
      error.name = 'UnauthorizedError';
      error.message = 'Incorrect email ou password';
      throw error;
    }

    return this.result;
  }
}

// checkIfExistsId: async (id) => {
//   const exists = await db.User.findOne({
//     attributes: { exclude: ['id', 'displayName', 'image'] },
//     where: { id },
//   });
