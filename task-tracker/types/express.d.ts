import { IJwtPayload } from '../src/common/interfaces/jwt-payload.interface';

declare global {
  namespace Express {
    interface User extends IJwtPayload {}

    export interface Request {
      user?: User; // Passport обычно ищет именно в Request.user
    }
  }
}
