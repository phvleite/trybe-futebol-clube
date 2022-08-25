import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/team';
import { ITeam } from '../interfaces/ITeam';
import 'dotenv';

chai.use(chaiHttp);

const { expect } = chai;

const teamMock: ITeam = {
  id: 1,
  teamName: 'usernamemock',
}

describe('Get /teams', () => {
  it('deve retorna status 200', async () => {
    sinon.stub(Team, 'findAll').resolves([teamMock as Team]);

    const response = await chai.request(app).get('/teams');

    expect(response.status).to.be.eq(200);

    sinon.restore();
  });

  it('deve retorna uma lista de times', async () => {
    sinon.stub(Team, 'findAll').resolves([teamMock as Team]);

    const response = await chai.request(app).get('/teams');

    const [teams] = response.body as ITeam[];

    expect(teams.id).to.equal(teamMock.id);
    expect(teams.teamName).to.equal(teamMock.teamName);

    sinon.restore();
  });
})
