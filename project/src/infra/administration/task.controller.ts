import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  HttpCode,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { isObjectId } from 'src/utils/generic';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('task')
@ApiTags('Tasks')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('status')
  @HttpCode(200)
  getTaskStatus() {
    return this.taskService.getTaskStatus();
  }

  @Post()
  @HttpCode(201)
  //TODO only Manager/Administrator
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @HttpCode(200)
  findAll(@Query() { page, sort, vehicle, status }) {
    const activeSearch = { status };
    const vehicleSearch = { vehicle };
    let ors = [];
    if (status) ors.push(activeSearch);
    if (vehicle) ors.push(vehicleSearch);
    const search = {
      $or: ors,
    };
    return this.taskService.findAll(page, sort, ors.length > 0 ? search : {});
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    return this.taskService.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    if (!isObjectId(id)) throw new BadRequestException();
    return this.taskService.update(id, updateTaskDto);
  }

  @Post(':id/message')
  sendMessage(@Param('id') id: string, @Body('message') message: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    const authorId: string = '62adf02932166e1cb78141a8'; //TODO GET FROM TOKEN
    return this.taskService.sendMessage(id, authorId, message);
  }

  @Put(':id/message/:message_id')
  updateMessage(
    @Param('id') id: string,
    @Param('message_id') message_id: string,
    @Body('message') message: string,
  ) {
    if (!isObjectId(id)) throw new BadRequestException();
    const authorId: string = '62adf02932166e1cb78141a8'; //TODO GET FROM TOKEN
    console.log(id, authorId, message_id, message);
    return this.taskService.updateMessage(id, authorId, message_id, message);
  }

  @Delete(':id/message/:message_id')
  @HttpCode(204)
  deleteMessage(
    @Param('id') id: string,
    @Param('message_id') message_id: string,
  ) {
    if (!isObjectId(id)) throw new BadRequestException();
    if (!isObjectId(message_id)) throw new BadRequestException();
    const authorId = '62adf02932166e1cb78141a8'; //TODO GET FROM TOKEN
    return this.taskService.deleteMessage(id, message_id, authorId);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    return this.taskService.remove(id);
  }
}
