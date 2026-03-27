import { CheckGroupOwnershipDto } from '../../../common/dto/check-group-ownership.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskTextDto extends CheckGroupOwnershipDto {
  @IsString()
  @IsNotEmpty()
  text: string;
  @IsString()
  @IsNotEmpty()
  taskId: string;
}
