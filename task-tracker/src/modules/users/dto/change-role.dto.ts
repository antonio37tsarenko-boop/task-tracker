import { UserRoles } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ChangeRoleDto {
  @IsEnum(UserRoles)
  role: UserRoles;
}
