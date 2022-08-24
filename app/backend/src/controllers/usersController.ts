import { Request, Response } from 'express';
import UserService from '../services/usersService';

export default class UserController {
  constructor(private userService: UserService) { }

  async checkIfExistEmail(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error();
      error.name = 'ValidationError';
      error.message = 'All fields must be filled';
      throw error;
    }

    const result = await this.userService.checkIfExistEmail(email, password);
    res.status(200).json(result);
  }
}
