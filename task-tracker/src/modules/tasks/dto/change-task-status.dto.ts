import { BaseTaskDto } from './base-task.dto';
import { TaskStatuses } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ChangeTaskStatusDto extends BaseTaskDto {
  @IsEnum(TaskStatuses)
  status: TaskStatuses;
}
