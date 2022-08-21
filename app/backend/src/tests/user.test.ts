import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const userLoginMock = {
  email: "teste@teste.com",
  password: '123456789'
}

describe('Users', () => {

  it('Seu sub-teste', () => {
    expect(false).to.be.eq(true);
  });
});
