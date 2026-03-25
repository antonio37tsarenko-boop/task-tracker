import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { GROUP_EXISTS_ERROR, GROUP_NOT_EXISTS_ERROR } from './groups.constants';
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { CheckGroupOwnershipDto } from '../../common/dto/check-group-ownership.dto';
import { ChangeGroupNameDto } from './dto/change-group-name.dto';
import { ResStatuses } from '../../common/enums/res-status.enum';
import { Group, Prisma } from '@prisma/client';
import { multicast } from 'rxjs';

@Injectable()
export class GroupsService {
  logger: Logger = new Logger('GroupsService');
  constructor(private readonly prisma: PrismaService) {}

  async createGroup({ name }: CreateGroupDto, user: IJwtPayload) {
    let group: Group;
    try {
      group = await this.prisma.group.create({
        data: {
          name,
          userId: user.id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(GROUP_EXISTS_ERROR);
        }
      }
      throw e;
    }
    return {
      group,
      status: ResStatuses.DONE,
    };
  }

  async deleteGroup({ groupId }: CheckGroupOwnershipDto) {
    try {
      return {
        group: await this.prisma.group.delete({
          where: {
            id: groupId,
          },
        }),
        status: ResStatuses.DONE,
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2025') {
          throw new NotFoundException(GROUP_NOT_EXISTS_ERROR);
        }
      }
      throw e;
    }
  }

  async changeGroupName({ groupId, name }: ChangeGroupNameDto) {
    let group: Group;
    try {
      group = await this.prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          name,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2025') {
          throw new NotFoundException(GROUP_NOT_EXISTS_ERROR);
        }
      }
      throw e;
    }
    return {
      group,
      status: ResStatuses.DONE,
    };
  }

  async getGroupInfo({ groupId }: CheckGroupOwnershipDto) {
    const group = await this.prisma.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        tasks: true,
        id: true,
        name: true,
      },
    });
    if (!group) {
      throw new NotFoundException(GROUP_NOT_EXISTS_ERROR);
    }
    return {
      group,
      status: ResStatuses.DONE,
    };
  }

  getGroup(id: string) {
    return this.prisma.group.findUnique({
      where: { id },
    });
  }

  async getGroupOrThrow(id: string) {
    const group = await this.getGroup(id);

    if (!group) {
      throw new NotFoundException(GROUP_NOT_EXISTS_ERROR);
    }
    return group;
  }
}
