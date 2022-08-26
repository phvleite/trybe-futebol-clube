import Match from '../database/models/match';
import Team from '../database/models/team';

export default class MatchService {
  private matches: Match[] | null;

  async list(): Promise<Match[]> {
    this.matches = await Match.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    return this.matches;
  }

  async listByQuery(progress: boolean): Promise<Match[]> {
    this.matches = await Match.findAll({
      where: { inProgress: progress },
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    return this.matches;
  }
}
