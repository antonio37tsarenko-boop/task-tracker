import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import {PrismaClient} from '@prisma/client'


@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  constructor() {
    super();
  }

  logger: Logger = new Logger('PrismaService');
  onModuleInit(): any {
    this.$connect();
  }
  onApplicationShutdown(signal?: string): any {
    this.logger.log(`Signal ${signal} received, closing connection with database...`)
  }
}
