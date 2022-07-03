import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  StatusTicket,
  Ticket,
  TicketDocument,
} from 'src/Schemas/administration/ticket.schema';
import { getCurrentTimestamp } from 'src/utils/time';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ResponseTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name)
    private ticketModel: Model<TicketDocument>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const newTicket = await new this.ticketModel(createTicketDto).save();
    return newTicket;
  }

  async findAll(page: number = 1, sort: number = 1, filter: object = {}) {
    const limit = 10;
    const count = await this.ticketModel.find(filter).count();
    const lastPage = Math.ceil(count / limit);
    page = Math.ceil(count / limit) >= page ? page : 1;
    let toSort = {};
    toSort['createdAt'] = sort == 1 ? 1 : -1;
    const aux = await this.ticketModel
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

  async response(id: string, response: string) {
    const checkIfTicketExists = await this.ticketModel.findOne({ _id: id });

    if (!checkIfTicketExists) throw new NotFoundException();

    checkIfTicketExists.response = response;
    checkIfTicketExists.response_date = getCurrentTimestamp();
    checkIfTicketExists.status = StatusTicket[StatusTicket.TO_SEND];
    checkIfTicketExists.save();

    return checkIfTicketExists;
  }

  async findOne(id: string) {
    const checkIfTicketExists = await this.ticketModel.findOne({ _id: id });

    if (!checkIfTicketExists) throw new NotFoundException();

    return checkIfTicketExists;
  }

  async remove(id: string) {
    const checkIfTicketExists = await this.ticketModel.findOne({
      _id: id,
      status: {
        $nin: [
          StatusTicket[StatusTicket.CANCELLED],
          StatusTicket[StatusTicket.CLOSED],
        ],
      },
    });

    if (!checkIfTicketExists) throw new NotFoundException();

    checkIfTicketExists.status = StatusTicket[StatusTicket.CANCELLED];
    checkIfTicketExists.save();

    return;
  }
}
