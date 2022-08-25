import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/user';
import { IUser } from '../interfaces/IUser';
import passwordService from '../services/passwordService'
import * as jwt from 'jsonwebtoken';
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

describe('Post /login', () => {
  it('ao enviar um email e senha, deve retorna status 200 e um token', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(passwordService, 'comparePassword').resolves(true);

    const email: string ="mockemail@mockemail.com";
    const password: string = '123456789';

    const response = await chai.request(app).post('/login')
      .send({ email, password });

    expect(response.status).to.be.eq(200);
    expect(response.body).to.have.property('token');

    sinon.restore();
  });

  it('ao se fazer um login sem email, deve retorna status 400 e uma mensagem de erro', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(passwordService, 'comparePassword').resolves(true);

    const password: string = '123456789';

    const response = await chai.request(app).post('/login')
      .send({ password });

    expect(response.status).to.be.eq(400);
    expect(response.body).to.be.deep.eq({ "message": "All fields must be filled" });

    sinon.restore();
  });

  it('ao se fazer um login com um email inválido, deve retorna status 401 e uma mensagem de erro', async () => {
    sinon.stub(User, 'findOne').resolves(null);

    const email: string ="mockemail.com";
    const password: string = '123456789';

    const response = await chai.request(app).post('/login')
      .send({ email, password });

    expect(response.status).to.be.eq(401);
    expect(response.body).to.be.deep.eq({ "message": "Incorrect email or password" });

    sinon.restore();
  });

  it('ao se fazer um login com uma senha inválida, deve retorna status 401 e uma mensagem de erro', async () => {
    sinon.stub(User, 'findOne').resolves(null);

    const email: string ="mockemail@mockemail.com";
    const password: string = '123';

    const response = await chai.request(app).post('/login')
      .send({ email, password });

    expect(response.status).to.be.eq(401);
    expect(response.body).to.be.deep.eq({ "message": "Incorrect email or password" });

    sinon.restore();
  });
})

describe('Get /login/validate', () => {
  it('ao solicitar uma validação, deve retorna status 200 e a função do usuário', async () => {
    const jwtSecret = String(process.env.JWT_SECRET);

    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(passwordService, 'comparePassword').resolves(true);

    const email: string ="mockemail@mockemail.com";
    const password: string = '123456789';

    const response = await chai.request(app).post('/login')
      .send({ email, password });

    const token = response.body.token;

    const result = await chai.request(app)
      .get('/login/validate')
      .set('Authorization', token); ;

    const data = jwt.verify(token, jwtSecret);

    expect(result.status).to.be.eq(200);
    expect(data).to.be.have.property('role');

    sinon.restore();
  });
})
