import { Request, Response } from 'express';
import UserService from '../services/usersService';

export default class UserController {
  constructor(private userService: UserService) { }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error();
      error.name = 'ValidationError';
      error.message = 'All fields must be filled';
      throw error;
    }

    const result = await this.userService.login(email, password);
    res.status(200).json(result);
  }

  loginValidate(req: Request, res: Response): void {
    const { authorization } = req.headers;
    if (!authorization) {
      const error = new Error();
      error.name = 'UnauthorizedError';
      error.message = 'Token must be a valid token';
      throw error;
    }
    const data = this.userService.loginValidate(authorization);
    res.status(200).json({ role: Object.values(data)[0] });
  }
}
