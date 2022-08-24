import { Request, Response } from 'express';
import UserService from '../services/usersService';

export default class UserController {
  constructor(private userService: UserService) { }

  async list(_req: Request, res: Response): Promise<void> {
    const users = await this.userService.list();
    res.status(200).json(users);
  }

  async checkIfExistEmail(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await this.userService.checkIfExistEmail(email, password);
    res.status(200).json(result);
  }
}
