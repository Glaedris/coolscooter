import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ResponseTicketDto } from './dto/update-ticket.dto';
import { isObjectId } from 'src/utils/generic';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('ticket')
@ApiTags('Tickets')
@ApiBearerAuth()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @HttpCode(201)
  //TODO authorization : GUEST
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Get()
  @HttpCode(200)
  findAll(@Query() { page, sort, status, email }) {
    const activeSearch = { status };
    const emailSearch = { email };
    let ors = [];
    if (status) ors.push(activeSearch);
    if (email) ors.push(emailSearch);
    const search = {
      $or: ors,
    };
    return this.ticketService.findAll(page, sort, ors.length > 0 ? search : {});
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    return this.ticketService.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  response(@Param('id') id: string, @Body('response') response: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    return this.ticketService.response(id, response);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    //TODO only manager/administrator
    if (!isObjectId(id)) throw new BadRequestException();
    return this.ticketService.remove(id);
  }
}
