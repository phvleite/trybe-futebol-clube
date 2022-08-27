import Joi = require('joi');
import Match from '../database/models/match';
import Team from '../database/models/team';

interface IValidateNewMatch {
  homeTeam: number;
  awayTeam: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

interface INewMatch extends IValidateNewMatch {
  inProgress: boolean;
}

interface ICreatedMactch extends INewMatch {
  id: number;
}

interface IValidateMatchId {
  id: number;
}

interface IValidateNewGoalsMatch {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

interface IUpdateNewGoalsMatch {
  id: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

interface IFinishedMatch {
  id: number;
  inProgress: boolean;
}

export default class MatchService {
  private matches: Match[] | null;
  private match: Match | null;
  private schema: Joi.ObjectSchema<unknown>;
  private _homeTeam: number;
  private _awayTeam: number;
  private _dataFinish: IFinishedMatch;

  validateParamsId(id: unknown): IValidateMatchId {
    this.schema = Joi.object({
      id: Joi.number().required().min(1),
    });

    const { error, value } = this.schema.validate(id);

    if (error) throw error;

    return value as IValidateMatchId;
  }

  validateBodyNewMatch(data: unknown): IValidateNewMatch {
    this.schema = Joi.object({
      homeTeam: Joi.number().required().min(1).integer(),
      awayTeam: Joi.number().required().min(1).integer(),
      homeTeamGoals: Joi.number().required().min(0).integer(),
      awayTeamGoals: Joi.number().required().min(0).integer(),
    });

    const { error, value } = this.schema.validate(data);

    if (error) throw error;

    return value as IValidateNewMatch;
  }

  validateBodyNewGoalsMatch(data: unknown): IValidateNewGoalsMatch {
    this.schema = Joi.object({
      homeTeamGoals: Joi.number().required().min(0).integer(),
      awayTeamGoals: Joi.number().required().min(0).integer(),
    });

    const { error, value } = this.schema.validate(data);

    if (error) throw error;

    return value as IValidateNewGoalsMatch;
  }

  validatesTeamsOfNewMatch(homeTeam: number, awayTeam: number): void {
    this._homeTeam = homeTeam;
    this._awayTeam = awayTeam;
    if (this._homeTeam === this._awayTeam) {
      const error = new Error();
      error.name = 'UnauthorizedError';
      error.message = 'It is not possible to create a match with two equal teams';
      throw error;
    }
  }

  async checkIfExistId(id: unknown): Promise<void> {
    this.match = await Match.findByPk(Number(id));

    if (!this.match) {
      const error = new Error();
      error.name = 'NotFoundError';
      error.message = 'There is no teams match with such id!';
      throw error;
    }
  }

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

  async create(data: INewMatch): Promise<ICreatedMactch> {
    this.match = await Match.create(data);
    return this.match as unknown as ICreatedMactch;
  }

  async update(data: IUpdateNewGoalsMatch): Promise<Match> {
    const { homeTeamGoals, awayTeamGoals, id } = data;
    await Match.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
    this.match = await Match.findByPk(id, {
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    return this.match as Match;
  }

  async finished(data: IFinishedMatch): Promise<void> {
    this._dataFinish = data;
    const { inProgress, id } = this._dataFinish;
    await Match.update(
      { inProgress },
      { where: { id } },
    );
  }
}
