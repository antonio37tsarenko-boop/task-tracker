import { UserRoles } from '@prisma/client';

export interface ISafeUser {
  email: string;
  id: string;
  name: string;
  role: UserRoles;
}
