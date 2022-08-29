import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/user';
import { IUser } from '../interfaces/IUser';
import passwordService from '../services/passwordService'
import Match from '../database/models/match';
import { IMatch } from '../interfaces/IMatch';
import 'dotenv';

chai.use(chaiHttp);

const { expect } = chai;

const userMock: IUser = {
  id: 1,
  username: 'usernamemock',
  role: 'rolemock',
  email: 'mockemail@mockemail.com',
  password: 'mockpassword',
}

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

const matchFinishMock: IMatch = {
  id: 1,
  homeTeam: 1,
  awayTeam: 2,
  homeTeamGoals: 2,
  awayTeamGoals: 0,
  inProgress: false,
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

describe('Post /matches', () => {
  it('ao enviar uma nova partida, deve retorna status 201 e a nova partida', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(passwordService, 'comparePassword').resolves(true);
    sinon.stub(Match, 'create').resolves(matchMock as unknown as Match);
  
    const email: string ="mockemail@mockemail.com";
    const password: string = '123456789';
  
    const response = await chai.request(app).post('/login')
      .send({ email, password });

    const token = response.body.token;
  
    const result = await chai.request(app)
      .post('/matches')
      .send({ homeTeam: 1, awayTeam: 2, homeTeamGoals: 2, awayTeamGoals: 0 })
      .set('Authorization', token); ;
  
    expect(result.status).to.be.eq(201);
    expect(result.body).to.be.have.property('homeTeam');
    expect(result.body).to.be.have.property('awayTeam');
    expect(result.body).to.be.have.property('homeTeamGoals');
    expect(result.body).to.be.have.property('awayTeamGoals');
    expect(result.body).to.be.have.property('inProgress');
  
    sinon.restore();
  });
})

describe('Patch /matches/:id/finish', () => {
  it('deve retorna status 200 e a mensagem "Finished"', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(passwordService, 'comparePassword').resolves(true);
    sinon.stub(Match, 'update');
  
    const idMatch = 1;
    const email: string ="mockemail@mockemail.com";
    const password: string = '123456789';
 
    const response = await chai.request(app).post('/login')
      .send({ email, password });
  
    const token = response.body.token;
  
    const result = await chai.request(app)
      .patch('/matches/' + idMatch + '/finish')
      .send({ inProgress: false })
      .set('Authorization', token); ;
  
    expect(result.status).to.be.eq(200);
    expect(result.body).to.be.deep.eq({ "message": "Finished" });
  
    sinon.restore();
  });
})

describe('Patch /matches/:id', () => {
  it('deve retorna status 200 e o novo resultado da partida', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(passwordService, 'comparePassword').resolves(true);
    sinon.stub(Match, 'update');
  
    const idMatch = 1;
    const email: string ="mockemail@mockemail.com";
    const password: string = '123456789';
  
    const response = await chai.request(app).post('/login')
      .send({ email, password });
  
    const token = response.body.token;
  
    const result = await chai.request(app)
      .patch('/matches/' + idMatch)
      .send({ homeTeamGoals: 3, awayTeamGoals: 0 })
      .set('Authorization', token); ;
  
    expect(result.status).to.be.eq(200);
    expect(result.body).to.be.have.property('homeTeam');
    expect(result.body).to.be.have.property('awayTeam');
    expect(result.body).to.be.have.property('homeTeamGoals');
    expect(result.body).to.be.have.property('awayTeamGoals');
  
    sinon.restore();
  });
})
