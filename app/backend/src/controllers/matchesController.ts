import { Request, Response } from 'express';
import MatchService from '../services/matchesService';

export default class MatchController {
  private progress: boolean;

  constructor(private matheService: MatchService) { }

  async list(req: Request, res: Response): Promise<void> {
    const { inProgress } = req.query;
    let result;
    if (!inProgress) {
      result = await this.matheService.list();
    } else {
      if (inProgress === 'true') {
        this.progress = true;
      } else {
        this.progress = false;
      }
      result = await this.matheService.listByQuery(this.progress);
    }
    res.status(200).json(result);
  }
}
