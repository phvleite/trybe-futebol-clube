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
  it('ao ser solicitado deve retorna status 200', async () => {
    sinon.stub(Team, 'findAll').resolves([teamMock as Team]);

    const response = await chai.request(app).get('/teams');

    expect(response.status).to.be.eq(200);

    sinon.restore();
  });

  it('ao ser solicitado deve retorna uma lista de times', async () => {
    sinon.stub(Team, 'findAll').resolves([teamMock as Team]);

    const response = await chai.request(app).get('/teams');

    const [teams] = response.body as ITeam[];

    expect(teams.id).to.equal(teamMock.id);
    expect(teams.teamName).to.equal(teamMock.teamName);

    sinon.restore();
  });
})

describe('Get /teams/:id', () => {
  it('se informado um id válido deve retorna status 200', async () => {
    sinon.stub(Team, 'findOne').resolves(teamMock as Team);

    const response = await chai.request(app).get('/teams/:id');

    expect(response.status).to.be.eq(200);

    sinon.restore();
  });

  it('se informado um id válido deve retorna um time', async () => {
    sinon.stub(Team, 'findOne').resolves(teamMock as Team);

    const response = await chai.request(app).get('/teams/:id');

    const teams = response.body as ITeam;

    expect(teams.id).to.equal(teamMock.id);
    expect(teams.teamName).to.equal(teamMock.teamName);

    sinon.restore();
  });

  it('se informado um id inválido deve retorna status 404', async () => {
    sinon.stub(Team, 'findOne').resolves(null);

    const response = await chai.request(app).get('/teams/:id');

    expect(response.status).to.be.eq(404);

    sinon.restore();
  });

  it('se informado um id inválido deve retorna um mensagem "Id not found"', async () => {
    sinon.stub(Team, 'findOne').resolves(null);

    const response = await chai.request(app).get('/teams/:id');

    const message = response.body;

    expect(message).to.be.deep.eq({ "message": "Id not found" });

    sinon.restore();
  });
})
