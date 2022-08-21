import { Request, Response } from 'express';
import { UserService } from '../services/usersService';

export default class UserController {
  constructor(private userService: UserService) { }

  async list(_req: Request, res: Response): Promise<void> {
    const users = await this.userService.list();
    res.status(200).json(users);
  }
}
