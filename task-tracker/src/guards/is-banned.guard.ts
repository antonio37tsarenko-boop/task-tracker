import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { IJwtPayload } from '../common/interfaces/jwt-payload.interface';
import { UsersService } from '../modules/users/users.service';
import { BANNED_ERROR } from '../common/constants';

@Injectable()
export class IsBannedGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const reqUser: IJwtPayload = req.user;
    if (!reqUser) {
      return true;
    }
    const user = await this.usersService.findByIdOrThrow(req.user.id);
    if (user.unbanDate && user.unbanDate > new Date()) {
      throw new ForbiddenException(BANNED_ERROR);
    }

    return true;
  }
}
