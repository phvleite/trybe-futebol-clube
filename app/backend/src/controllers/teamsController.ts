import { Request, Response } from 'express';
import TeamService from '../services/teamsService';

export default class TeamController {
  constructor(private teamService: TeamService) { }

  async list(_req: Request, res: Response): Promise<void> {
    const result = await this.teamService.list();
    res.status(200).json(result);
  }
}
