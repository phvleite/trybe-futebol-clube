//import Sinon, * as sinon from 'sinon';
import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
// import Example from '../database/models/ExampleModel';

// import { Response } from 'superagent';
import { beforeEach } from 'mocha';
import User from '../database/models/user';
import { IUser } from '../interfaces/IUser';
import JwtService from '../services/jwtService';
import passwordService from '../services/passwordService'

chai.use(chaiHttp);

const { expect } = chai;

const email: string ="teste@teste.com";
const password: string = '123456789';

const userMock: IUser = {
  id: 1,
  username: 'usernamemock',
  role: 'rolemock',
  email: 'mockemail@mockemail.com',
  password: 'mockpassword',
}

describe('Post /login', () => {
  it('ao enviar um email e senha, deve retorna status 200 e um token', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(passwordService, 'comparePassword').resolves(true);

    const response = await chai.request(app).post('/login')
      .send({ email, password });

    expect(response.status).to.be.eq(200);
    expect(response.body).to.have.property('token');

    sinon.restore();
  });
})
