import { Module } from '@nestjs/common';
import { AdministrationService } from './administration.service';
import { AdministrationController } from './administration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { schemaProviders } from './schema.providers';
import { TicketController } from './ticket.controller';
import { TaskController } from './task.controller';
import { TicketService } from './ticket.service';
import { TaskService } from './task.service';

@Module({
  imports: [MongooseModule.forFeature(schemaProviders)],
  controllers: [AdministrationController, TicketController, TaskController],
  providers: [AdministrationService, TicketService, TaskService],
})
export class AdministrationModule {}
