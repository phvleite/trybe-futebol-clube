import Team from '../database/models/team';
import { ITeamService } from '../interfaces/ITeamService';

export default class TeamService implements ITeamService {
  private teams: Team[] | null;

  async list(): Promise<Team[]> {
    this.teams = await Team.findAll();
    return this.teams;
  }
}
