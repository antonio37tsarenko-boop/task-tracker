import { CheckGroupOwnershipDto } from '../../../common/dto/check-group-ownership.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskNameDto extends CheckGroupOwnershipDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  taskId: string;
}
