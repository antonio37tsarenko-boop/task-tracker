import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { UsersService } from './users.service';
import { User } from '../../decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@User() user: IJwtPayload) {
    return this.usersService.getUser(user.id);
  }
}
