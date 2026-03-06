import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, MailerModule],
  exports: [UsersService],
})
export class UsersModule {}
