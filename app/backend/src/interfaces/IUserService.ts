// import User from '../database/models/user';

import { JwtPayload } from 'jsonwebtoken';

export interface IUserService {
  login(email: string, password: string): Promise<object>;
  loginValidate(authorization: string): string | JwtPayload;
}
