import {
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
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { UsersService } from './users.service';
import { User } from '../../decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { AdminGuard } from '../../guards/admin.guard';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UpdateMeDto } from './dto/update-me.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@User() user: IJwtPayload) {
    return this.usersService.getMe(user.id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllUsers(@Query() dto: GetAllUsersDto, @User() user: IJwtPayload) {
    return this.usersService.getAllUsers(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@User() user: IJwtPayload) {
    return this.usersService.deleteMe(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Body() dto: UpdateMeDto, @User() user: IJwtPayload) {
    return this.usersService.updateMe(dto, user.id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
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
