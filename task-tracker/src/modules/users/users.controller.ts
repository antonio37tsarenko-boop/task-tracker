import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { AdminGuard } from '../../guards/admin.guard';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { BanDto } from './dto/ban.dto';
import { NO_BAN_TIME_ERROR } from './users.constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@User() user: IJwtPayload) {
    return this.usersService.getMe(user.id);
  }

  @UseGuards(AdminGuard)
  @Get()
  async getAllUsers(@Query() dto: GetAllUsersDto, @User() user: IJwtPayload) {
    return this.usersService.getAllUsers(dto, user.id);
  }

  @Delete('me')
  async deleteMe(@User() user: IJwtPayload) {
    return this.usersService.deleteMe(user.id);
  }

  @Patch('me')
  async updateMe(@Body() dto: UpdateMeDto, @User() user: IJwtPayload) {
    return this.usersService.updateMe(dto, user.id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/ban')
  async ban(@Body() dto: BanDto, @Param('id') userId: string) {
    if (!Object.values(dto).some((v) => v !== undefined)) {
      throw new BadRequestException(NO_BAN_TIME_ERROR);
    }
    return this.usersService.ban(dto, userId);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/unban')
  async unban(@Param('id') userId: string) {
    return this.usersService.unban(userId);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/role')
  async changeRole(
    @Param('id') id: string,
    @Body() dto: ChangeRoleDto,
    @User() user: IJwtPayload,
  ) {
    if (id == user.id) {
      throw new ForbiddenException();
    }
    return this.usersService.changeRole(id, dto.role);
  }
}
