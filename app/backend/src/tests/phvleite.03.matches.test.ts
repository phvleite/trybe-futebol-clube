import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/match';
import { IMatch } from '../interfaces/IMatch';
import 'dotenv';

chai.use(chaiHttp);

const { expect } = chai;

const matchMock: IMatch = {
  id: 1,
  homeTeam: 1,
  awayTeam: 2,
  homeTeamGoals: 2,
  awayTeamGoals: 0,
  inProgress: true,
  teamHome: {
    teamName: 'time-da-casa',
  },
  teamAway: {
    teamName: 'time-visitante',
  },
}

describe('Get /matches', () => {
  it('ao ser solicitado deve retorna status 200', async () => {
    sinon.stub(Match, 'findAll').resolves([matchMock as unknown as Match]);

    const response = await chai.request(app).get('/matches');

    expect(response.status).to.be.eq(200);

    sinon.restore();
  });

  it('ao ser solicitado deve retorna uma lista de partidas', async () => {
    sinon.stub(Match, 'findAll').resolves([matchMock as unknown as Match]);

    const response = await chai.request(app).get('/matches');

    const [matches] = response.body as IMatch[];

    expect(matches.id).to.equal(matchMock.id);
    expect(matches.homeTeam).to.equal(matchMock.homeTeam);
    expect(matches.awayTeam).to.equal(matchMock.awayTeam);
    expect(matches.homeTeamGoals).to.equal(matchMock.homeTeamGoals);
    expect(matches.awayTeamGoals).to.equal(matchMock.awayTeamGoals);
    expect(matches.inProgress).to.equal(matchMock.inProgress);
    expect(matches.teamHome.teamName).to.equal(matchMock.teamHome.teamName);
    expect(matches.teamAway.teamName).to.equal(matchMock.teamAway.teamName);

    sinon.restore();
  });
})
