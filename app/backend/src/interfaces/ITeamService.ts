import Team from '../database/models/team';

export interface ITeamService {
  list(): Promise<Team[]>;
}
