import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import MatchService from '../services/matchesService';
import TeamService from '../services/teamsService';
import Classification from '../services/classificationService';

export default class LeaderboardController {
  private data: string | JwtPayload;
  private teamService = new TeamService();
  private macthService = new MatchService();
  private classification = new Classification();

  async list(_req: Request, res: Response): Promise<void> {
    const teams = await this.teamService.list();
    const inProgress = false;
    const matches = await this.macthService.listByQuery(inProgress);
    const result = this.classification.rank(teams, matches);
    res.status(200).json(result);
  }
}
