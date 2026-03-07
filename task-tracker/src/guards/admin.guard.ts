import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IJwtPayload } from '../common/interfaces/jwt-payload.interface';
import { UserRoles } from '@prisma/client';
import { AVAILABLE_FOR_ADMINS_ERROR } from '../common/constants';

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user: IJwtPayload = context.switchToHttp().getRequest().user;
    if (user.role !== UserRoles.ADMIN) {
      throw new ForbiddenException(AVAILABLE_FOR_ADMINS_ERROR);
    }
    return true;
  }
}
