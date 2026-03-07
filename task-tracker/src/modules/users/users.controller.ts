import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { UsersService } from './users.service';
import { User } from '../../decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { AdminGuard } from '../../guards/admin.guard';
import { GetAllUsersDto } from './dto/get-all-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@User() user: IJwtPayload) {
    return this.usersService.getUser(user.id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllUsers(@Query() dto: GetAllUsersDto, @User() user: IJwtPayload) {
    return this.usersService.getAllUsers(dto, user.id);
  }
}
