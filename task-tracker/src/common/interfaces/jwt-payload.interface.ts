import { UserRoles } from '../enums/user-roles.enum';

export class IJwtPayload {
  id: string;
  email: string;
  role?: UserRoles = UserRoles.USER;
}
