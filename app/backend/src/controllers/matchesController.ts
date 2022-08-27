import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import MatchService from '../services/matchesService';
import TeamService from '../services/teamsService';
import JwtService from '../services/jwtService';

export default class MatchController {
  private progress: boolean;
  private data: string | JwtPayload;
  private teamService = new TeamService();

  constructor(private matcheService: MatchService) { }

  async list(req: Request, res: Response): Promise<void> {
    const { inProgress } = req.query;
    let result;
    if (!inProgress) {
      result = await this.matcheService.list();
    } else {
      if (inProgress === 'true') {
        this.progress = true;
      } else {
        this.progress = false;
      }
      result = await this.matcheService.listByQuery(this.progress);
    }
    res.status(200).json(result);
  }

  async create(req: Request, res: Response): Promise<void> {
    const { authorization } = req.headers;
    const { homeTeam, awayTeam, homeTeamGoals,
      awayTeamGoals } = this.matcheService.validateBodyNewMatch(req.body);
    this.matcheService.validatesTeamsOfNewMatch(homeTeam, awayTeam);
    const authValidate = JwtService.validateAuthorization(authorization);
    this.data = JwtService.validateToken(authValidate);
    await this.teamService.checkIfExistId(homeTeam);
    await this.teamService.checkIfExistId(awayTeam);
    const dataNewMatch = {
      homeTeam,
      homeTeamGoals,
      awayTeam,
      awayTeamGoals,
      inProgress: true };
    const newMatch = await this.matcheService.create(dataNewMatch);
    res.status(201).json(newMatch);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { authorization } = req.headers;
    const { id } = this.matcheService.validateParamsId(req.params);
    this.matcheService.checkIfExistId(id);
    const { homeTeamGoals, awayTeamGoals } = this.matcheService.validateBodyNewGoalsMatch(req.body);
    const authValidate = JwtService.validateAuthorization(authorization);
    this.data = JwtService.validateToken(authValidate);
    const dataNewGoalsMacth = {
      homeTeamGoals, awayTeamGoals, id };
    const newGoalsMatch = await this.matcheService.update(dataNewGoalsMacth);
    res.status(200).json(newGoalsMatch);
  }
}
