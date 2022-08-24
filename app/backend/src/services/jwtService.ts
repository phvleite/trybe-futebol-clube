import * as jwt from 'jsonwebtoken';
import 'dotenv';

const jwtSecret = String(process.env.JWT_SECRET);

export default class JwtService {
  static sign(payload: { role: string, email: string }): string {
    return jwt.sign(payload, jwtSecret);
  }

  static validateToken(token: string) {
    try {
      const data = jwt.verify(token, jwtSecret);
      return data;
    } catch (e) {
      const error = new Error('Expired or invalid token');
      error.name = 'UnauthorizedError';
      throw error;
    }
  }
}
