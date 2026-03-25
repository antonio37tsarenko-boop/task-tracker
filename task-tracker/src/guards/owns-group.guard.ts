import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
import e from 'express';

// requires column "groupId" in body
@Injectable()
export class OwnsGroupGuard implements CanActivate {
  logger: Logger = new Logger('OwnsGroupGuard');
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: e.Request = context.switchToHttp().getRequest();
    const userIdFromReq = request.user?.id;
    if (!userIdFromReq) return false;

    const groupId: string = request.body.groupId;
    if (!groupId) {
      throw new BadRequestException('groupId must be a string');
    }

    const group = await this.prisma.group.findFirst({
      where: {
        userId: userIdFromReq,
      },
      select: { userId: true },
    });

    return Boolean(group && group.userId == userIdFromReq);
  }
}
