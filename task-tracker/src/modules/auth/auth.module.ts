import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  imports: [PrismaModule, CacheModule, MailerModule],
  controllers: [AuthController],
})
export class AuthModule {}
