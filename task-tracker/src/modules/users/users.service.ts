import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, UserRoles } from '@prisma/client';
import {
  USER_EXISTS_ERROR,
  USER_NOT_EXISTS_ERROR,
} from '../../common/constants';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { ResStatuses } from '../../common/enums/res-status.enum';
import { UpdateMeDto } from './dto/update-me.dto';
import { getSafeUser } from '../../utils/get-safe-user.util';
import { BanDto } from './dto/ban.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class UsersService {
  logger: Logger = new Logger('UsersService');
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Omit<
      User,
      'id' | 'createdAt' | 'updatedAt' | 'isBanned' | 'unbanDate'
    >,
  ) {
    const user = await this.prisma.user.create({
      data,
    });
    this.logger.log(`User ${user.id} is created.`);

    return user;
  }

  async delete(id: string): Promise<boolean> {
    const { count } = await this.prisma.user.deleteMany({
      where: { id },
    });
    const result = count > 0;
    if (result) {
      this.logger.log(`User ${id} is deleted.`);
    }
    return result;
  }

  async deleteOrThrow(id: string) {
    const result = await this.delete(id);
    if (!result) {
      throw new NotFoundException(USER_NOT_EXISTS_ERROR);
    }
    return true;
  }

  async changeProperty<
    T extends keyof Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  >(id: string, property: T, value: User[T]): Promise<boolean> {
    const { count } = await this.prisma.user.updateMany({
      where: { id },
      data: {
        [property]: value,
      },
    });
    this.logger.log(`Property ${property} of user ${id} is changed.`);

    return count > 0;
  }

  createOrThrow(
    data: Omit<
      User,
      'id' | 'createdAt' | 'updatedAt' | 'isBanned' | 'unbanDate'
    >,
  ) {
    try {
      return this.create(data);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(USER_EXISTS_ERROR);
        }
      }
      throw e;
    }
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByEmailOrThrow(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException(USER_NOT_EXISTS_ERROR);
    }
    return user;
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByIdOrThrow(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_EXISTS_ERROR);
    }
    return user;
  }

  async getMe(id: string) {
    const safeUser = getSafeUser(await this.findByIdOrThrow(id));
    return { ...safeUser };
  }

  async getAllUsers({ skip, take }: GetAllUsersDto) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      status: ResStatuses.DONE,
      users,
      total,
    };
  }

  async deleteMe(id: string) {
    await this.deleteOrThrow(id);
    return {
      status: ResStatuses.DONE,
    };
  }

  async changeRole(id: string, role: UserRoles) {
    const isDone = await this.changeProperty(id, 'role', role);
    if (!isDone) {
      throw new NotFoundException(USER_NOT_EXISTS_ERROR);
    }
    return {
      status: ResStatuses.DONE,
    };
  }

  async updateMe(data: UpdateMeDto, id: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: data,
      });
      return {
        status: ResStatuses.DONE,
        user: getSafeUser(user),
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(USER_NOT_EXISTS_ERROR);
        }
      }
      throw e;
    }
  }

  async ban(dto: BanDto, userId: string) {
    const user = await this.findByIdOrThrow(userId);
    let unbanDate = dayjs();

    if (dto.years) unbanDate = unbanDate.add(dto.years, 'year');
    if (dto.months) unbanDate = unbanDate.add(dto.months, 'month');
    if (dto.days) unbanDate = unbanDate.add(dto.days, 'day');
    if (dto.hours) unbanDate = unbanDate.add(dto.hours, 'hour');
    if (dto.minutes) unbanDate = unbanDate.add(dto.minutes, 'minute');

    const finalDate = unbanDate.toDate();
    await this.changeProperty(userId, 'unbanDate', finalDate);

    return {
      status: ResStatuses.DONE,
      user: getSafeUser(user),
    };
  }

  async unban(userId: string) {
    const user = await this.findByIdOrThrow(userId);
    await this.changeProperty(userId, 'unbanDate', null);

    return {
      status: ResStatuses.DONE,
      user: getSafeUser(user),
    };
  }
}
