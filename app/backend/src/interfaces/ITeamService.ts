import Team from '../database/models/team';

export interface ITeamService {
  list(): Promise<Team[]>;
  getTeamById(id: number): Promise<Team>;
}
