import * as jwt from 'jsonwebtoken';
import 'dotenv';

const jwtSecret = String(process.env.JWT_SECRET);

export default class JwtService {
  static sign(payload: { id: number, email: string }): string {
    return jwt.sign(payload, jwtSecret);
  }
}
