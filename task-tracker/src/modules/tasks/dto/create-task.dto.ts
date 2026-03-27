import { CheckGroupOwnershipDto } from '../../../common/dto/check-group-ownership.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto extends CheckGroupOwnershipDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text?: string;
}
