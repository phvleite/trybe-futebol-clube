import { Request, Response } from 'express';
import MatchService from '../services/matchesService';

export default class MatchController {
  constructor(private matheService: MatchService) { }

  async list(_req: Request, res: Response): Promise<void> {
    const result = await this.matheService.list();
    res.status(200).json(result);
  }
}
