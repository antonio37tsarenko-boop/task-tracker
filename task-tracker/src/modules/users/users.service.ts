import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import {
  USER_EXISTS_ERROR,
  USER_NOT_EXISTS_ERROR,
} from '../../common/constants';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.prisma.user.create({
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    const { count } = await this.prisma.user.deleteMany({
      where: { id },
    });
    return count > 0;
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
    return count > 0;
  }

  createOrThrow(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
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
      throw new BadRequestException(USER_NOT_EXISTS_ERROR);
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
      throw new BadRequestException(USER_NOT_EXISTS_ERROR);
    }
    return user;
  }
}
