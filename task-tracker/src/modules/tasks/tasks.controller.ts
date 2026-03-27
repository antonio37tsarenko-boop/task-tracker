import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { OwnsGroupGuard } from '../../guards/owns-group.guard';
import { UpdateTaskTextDto } from './dto/update-task-text.dto';
import { ChangeTaskStatusDto } from './dto/change-task-status.dto';
import { BaseTaskDto } from './dto/base-task.dto';
import { UpdateTaskNameDto } from './dto/update-task-name.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(OwnsGroupGuard)
  createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto);
  }

  @Patch('text')
  async updateTaskText(@Body() dto: UpdateTaskTextDto) {
    return this.tasksService.updateTaskText(dto);
  }
}
