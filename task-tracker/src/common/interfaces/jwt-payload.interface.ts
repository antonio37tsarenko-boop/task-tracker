import { UserRoles } from '@prisma/client';

export class IJwtPayload {
  id: string;
  email: string;
  role?: UserRoles | null = UserRoles.USER;
  isBanned?: boolean = false;
}
