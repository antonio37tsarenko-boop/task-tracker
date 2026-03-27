import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskTextDto } from './dto/update-task-text.dto';
import { BaseTaskDto } from './dto/base-task.dto';
import { Prisma, Task, TaskStatuses } from '@prisma/client';
import { USER_NOT_EXISTS_ERROR } from '../../common/constants';
import { TASK_EXISTS_ERROR, TASK_NOT_EXISTS_ERROR } from './tasks.constants';
import { ResStatuses } from '../../common/enums/res-status.enum';
import { GROUP_NOT_EXISTS_ERROR } from '../groups/groups.constants';
import { ChangeTaskStatusDto } from './dto/change-task-status.dto';
import { UpdateTaskNameDto } from './dto/update-task-name.dto';

@Injectable()
export class TasksService {
  logger: Logger = new Logger('TasksService');
  constructor(private readonly prisma: PrismaService) {}

  async createTask({ name, text, groupId }: CreateTaskDto) {
    let task: Task;
    try {
      task = await this.prisma.task.create({
        data: {
          name,
          text,
          groupId,
          status: TaskStatuses.NOT_COMPLETED,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2003') {
          throw new NotFoundException(USER_NOT_EXISTS_ERROR);
        } else if (e.code == 'P2025') {
          throw new ConflictException(TASK_EXISTS_ERROR);
        }
      }
      throw e;
    }

    const { createdAt, ...cleanTask } = task;
    return {
      task: cleanTask,
      status: ResStatuses.DONE,
    };
  }

  async updateTaskText({ taskId, text }: UpdateTaskTextDto) {
    const { createdAt, ...cleanTask } = await this.updateTaskPropertyOrThrow(
      taskId,
      'text',
      text,
    );

    return {
      task: cleanTask,
      status: ResStatuses.DONE,
    };
  }

  updateTaskProperty<T extends Prisma.TaskScalarFieldEnum>(
    id: string,
    field: T,
    value: Task[T],
  ) {
    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        [field]: value,
      },
    });
  }

  updateTaskPropertyOrThrow<T extends Prisma.TaskScalarFieldEnum>(
    id: string,
    field: T,
    value: Task[T],
  ) {
    try {
      return this.updateTaskProperty(id, field, value);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2025') {
          throw new NotFoundException(TASK_NOT_EXISTS_ERROR);
        }
      }
      throw e;
    }
  }

  async updateTaskName({ taskId, name }: UpdateTaskNameDto) {
    const { createdAt, ...cleanTask } = await this.updateTaskPropertyOrThrow(
      taskId,
      'text',
      name,
    );

    return {
      task: cleanTask,
      status: ResStatuses.DONE,
    };
  }

  async changeTaskStatus({ taskId, status }: ChangeTaskStatusDto) {
    const { createdAt, ...task } = await this.updateTaskPropertyOrThrow(
      taskId,
      'status',
      status,
    );

    return {
      task,
      status: ResStatuses.DONE,
    };
  }
}
