import {
  Get,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { exec } from 'child_process';
import { isNumber } from 'class-validator';
import { Model, Types } from 'mongoose';
import { Message } from 'src/Schemas/administration/messages.schema';
import {
  StatusTask,
  Task,
  TaskDocument,
} from 'src/Schemas/administration/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const newTask = await new this.taskModel(createTaskDto).save();
    return newTask;
  }

  async findAll(page: number = 1, sort: number = 1, filter: object = {}) {
    const limit = 10;
    const count = await this.taskModel.find(filter).count();
    const lastPage = Math.ceil(count / limit);
    page = Math.ceil(count / limit) >= page ? page : 1;
    let toSort = {};
    toSort['createdAt'] = sort == 1 ? 1 : -1;
    const aux = await this.taskModel
      .find(filter)
      .sort(toSort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return {
      count: count,
      data: aux,
      perPage: limit,
      page: +page,
      firstPage: 1,
      lastPage: lastPage ? lastPage : 1,
    };
  }

  async findOne(id: string) {
    const checkIfTicketExists = await this.taskModel.findOne({ _id: id });

    if (!checkIfTicketExists) throw new NotFoundException();

    return checkIfTicketExists;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const checkIfTicketExists = await this.taskModel.findOne({ _id: id });

    if (!checkIfTicketExists) throw new NotFoundException();

    await checkIfTicketExists.updateOne(updateTaskDto).exec();

    return await this.taskModel.findOne({ _id: id });
  }

  async getTaskStatus() {
    const statusList = Object.values(StatusTask)
      .filter(
        (status) =>
          status != StatusTask[StatusTask.CANCELLED] && !isNumber(status),
      )
      .map((status) => status);
    return statusList;
  }

  async sendMessage(id: string, authorId: string, message: string) {
    const checkIfTicketExists = await this.taskModel.findOne({ _id: id });

    if (!checkIfTicketExists) throw new NotFoundException();

    let newMessage = new Message();
    newMessage.content = message;
    newMessage.author = new Types.ObjectId(authorId);

    const messages: any = checkIfTicketExists.messages
      ? [...checkIfTicketExists.messages, newMessage]
      : [newMessage];

    checkIfTicketExists.messages = messages;
    await checkIfTicketExists.save();
    return checkIfTicketExists;
  }

  async deleteMessage(id: string, message_id: string, author_id: string) {
    const removeMessage = await this.taskModel
      .updateOne(
        {
          $and: [
            { _id: id },
            { 'messages._id': new Types.ObjectId(message_id) },
            { 'messages.author': new Types.ObjectId(author_id) },
          ],
        },
        {
          $pull: {
            messages: {
              $and: [
                { _id: new Types.ObjectId(message_id) },
                { author: new Types.ObjectId(author_id) },
              ],
            },
          },
        },
        { safe: true, multi: true },
      )
      .exec();

    if (removeMessage.matchedCount == 0) throw new NotFoundException();
    if (removeMessage.modifiedCount != 1)
      throw new InternalServerErrorException();

    return;
  }

  async updateMessage(
    id: string,
    author_id: string,
    message_id: string,
    message: string,
  ) {
    const removeMessage = await this.taskModel
      .updateOne(
        {
          $and: [
            { _id: id },
            { 'messages._id': new Types.ObjectId(message_id) },
            { 'messages.author': new Types.ObjectId(author_id) },
          ],
        },
        {
          $set: { 'messages.$.content': message },
        },
      )
      .exec();

    if (removeMessage.matchedCount == 0) throw new NotFoundException();
    if (removeMessage.modifiedCount != 1)
      throw new InternalServerErrorException();

    return;
  }

  async remove(id: string) {
    //TODO ONLY MANAGER + ADMIN
    const checkIfTaskExists = await this.taskModel.findOne({
      _id: id,
      status: {
        $nin: [StatusTask[StatusTask.CANCELLED], StatusTask[StatusTask.CLOSED]],
      },
    });

    if (!checkIfTaskExists) throw new NotFoundException();

    checkIfTaskExists.status = StatusTask[StatusTask.CANCELLED];
    checkIfTaskExists.save();

    return;
  }
}
