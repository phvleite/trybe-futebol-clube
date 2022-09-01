import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import MatchService from '../services/matchesService';
import TeamService from '../services/teamsService';
import JwtService from '../services/jwtService';

export default class MatchController {
  private progress: boolean;
  private data: string | JwtPayload;
  private teamService = new TeamService();

  constructor(private matchService: MatchService) { }

  async list(req: Request, res: Response): Promise<void> {
    const { inProgress } = req.query;
    let result;
    if (!inProgress) {
      result = await this.matchService.list();
    } else {
      if (inProgress === 'true') {
        this.progress = true;
      } else {
        this.progress = false;
      }
      result = await this.matchService.listByQuery(this.progress);
    }
    res.status(200).json(result);
  }

  async create(req: Request, res: Response): Promise<void> {
    const { authorization } = req.headers;
    const dbNewMatch = this.matchService.validateBodyNewMatch({ ...req.body, inProgress: true });
    this.matchService.validatesTeamsOfNewMatch(dbNewMatch.homeTeam, dbNewMatch.awayTeam);
    const authValidate = JwtService.validateAuthorization(authorization);
    this.data = JwtService.validateToken(authValidate);
    await this.teamService.checkIfExistId(dbNewMatch.homeTeam);
    await this.teamService.checkIfExistId(dbNewMatch.awayTeam);
    const newMatch = await this.matchService.create(dbNewMatch);
    res.status(201).json(newMatch);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { authorization } = req.headers;
    const { id } = this.matchService.validateParamsId(req.params);
    this.matchService.checkIfExistId(id);
    const { homeTeamGoals, awayTeamGoals } = this.matchService.validateBodyNewGoalsMatch(req.body);
    const authValidate = JwtService.validateAuthorization(authorization);
    this.data = JwtService.validateToken(authValidate);
    const dataNewGoalsMacth = {
      homeTeamGoals, awayTeamGoals, id };
    const newGoalsMatch = await this.matchService.update(dataNewGoalsMacth);
    res.status(200).json(newGoalsMatch);
  }

  async finished(req: Request, res: Response): Promise<void> {
    const { authorization } = req.headers;
    const { id } = this.matchService.validateParamsId(req.params);
    this.matchService.checkIfExistId(id);
    const authValidate = JwtService.validateAuthorization(authorization);
    this.data = JwtService.validateToken(authValidate);
    console.log(this.data);
    const dataNewGoalsMacth = {
      inProgress: false, id };
    await this.matchService.finished(dataNewGoalsMacth);
    res.status(200).json({ message: 'Finished' });
  }
}
