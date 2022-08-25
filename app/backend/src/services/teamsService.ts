import Team from '../database/models/team';
import { ITeamService } from '../interfaces/ITeamService';

export default class TeamService implements ITeamService {
  private teams: Team[] | null;
  private team: Team | null;

  async list(): Promise<Team[]> {
    this.teams = await Team.findAll();
    return this.teams;
  }

  async getTeamById(id: number): Promise<Team> {
    this.team = await Team.findOne({ where: { id } });

    if (!this.team) {
      const error = new Error();
      error.name = 'NotFoundError';
      error.message = 'Id not found';
      throw error;
    }

    return this.team;
  }
}
