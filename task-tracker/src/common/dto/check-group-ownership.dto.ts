import { IsNotEmpty, IsString } from 'class-validator';

export abstract class CheckGroupOwnershipDto {
  @IsString()
  @IsNotEmpty()
  groupId: string;
}
