import { Request, Response } from 'express';
import TeamService from '../services/teamsService';

export default class TeamController {
  constructor(private teamService: TeamService) { }

  async list(_req: Request, res: Response): Promise<void> {
    const result = await this.teamService.list();
    res.status(200).json(result);
  }

  async getTeamById(req: Request, res: Response): Promise<void> {
    const { id } = this.teamService.validateParamsId(req.params);
    const team = await this.teamService.getTeamById(Number(id));
    res.status(200).json(team);
  }
}
