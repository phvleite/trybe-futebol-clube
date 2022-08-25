import Joi = require('joi');
import Team from '../database/models/team';
import { ITeamService } from '../interfaces/ITeamService';

interface IValidateTeamId {
  id: number;
}

export default class TeamService implements ITeamService {
  private teams: Team[] | null;
  private team: Team | null;
  private schema: Joi.ObjectSchema<unknown>;

  validateParamsId(data: unknown): IValidateTeamId {
    this.schema = Joi.object({
      id: Joi.number().required().min(1),
    });

    const { error, value } = this.schema.validate(data);

    if (error) throw error;

    return value as IValidateTeamId;
  }

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
