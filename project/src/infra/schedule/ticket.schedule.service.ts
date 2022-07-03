import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TicketCronService {
  @Cron(CronExpression.EVERY_MINUTE)
  updateTicket() {
    //UPDATE TO_SEND TICKET
  }
}
