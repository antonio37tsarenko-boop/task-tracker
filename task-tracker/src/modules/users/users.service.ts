import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, User } from '@prisma/client';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<User, "id" | "createdAt" | "updatedAt">){
    return this.prisma.user.create({
      data
    })
  }

  async delete(id: string): Promise<boolean>{
    const {count} = await this.prisma.user.deleteMany({
      where: { id },
    });
    return count > 0
  }

  async changeProperty<T extends keyof Omit<User,"id" | "createdAt" | "updatedAt">>(
    id: string,
    property: T,
    value: User[T]
  ): Promise<boolean>{
    const {count} = await this.prisma.user.updateMany({
      where: {id},
      data: {
        [property]: value
      }
    })
    return count > 0
  }
}
