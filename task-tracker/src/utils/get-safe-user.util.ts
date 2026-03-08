import { User, UserRoles } from '@prisma/client';
import { ISafeUser } from '../common/interfaces/safe-user.interface';

export function getSafeUser({ email, id, name, role }: User): ISafeUser {
  return {
    email,
    id,
    name,
    role: role || UserRoles.USER,
  };
}
