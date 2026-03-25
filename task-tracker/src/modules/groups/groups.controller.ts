import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { User } from '../../decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { OwnsGroupGuard } from '../../guards/owns-group.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import { CheckGroupOwnershipDto } from '../../common/dto/check-group-ownership.dto';
import { ChangeGroupNameDto } from './dto/change-group-name.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async createGroup(@Body() dto: CreateGroupDto, @User() user: IJwtPayload) {
    return this.groupsService.createGroup(dto, user);
  }

  @Delete()
  @UseGuards(OwnsGroupGuard)
  async deleteGroup(@Body() dto: CheckGroupOwnershipDto) {
    return this.groupsService.deleteGroup(dto);
  }

  @Patch('name')
  @UseGuards(OwnsGroupGuard)
  async changeGroupName(@Body() dto: ChangeGroupNameDto) {
    return this.groupsService.changeGroupName(dto);
  }

  @Get('info')
  @UseGuards(OwnsGroupGuard)
  getGroupInfo(@Body() dto: CheckGroupOwnershipDto) {
    return this.groupsService.getGroupInfo(dto);
  }

  @Get()
  getUserGroups(@User() user: IJwtPayload) {
    return this.groupsService.getUserGroups(user);
  }
}
