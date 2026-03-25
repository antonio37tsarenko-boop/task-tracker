import { CheckGroupOwnershipDto } from '../../../common/dto/check-group-ownership.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeGroupNameDto extends CheckGroupOwnershipDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
