import { CheckGroupOwnershipDto } from '../../../common/dto/check-group-ownership.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class BaseTaskDto extends CheckGroupOwnershipDto {
  @IsString()
  @IsNotEmpty()
  taskId: string;
}
