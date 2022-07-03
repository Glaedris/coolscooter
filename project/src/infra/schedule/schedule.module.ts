import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthCronService } from './auth.schedule.service';
import { ResetCronService } from './reset.schedule.service';
import { schemaProviders } from './schemas.providers';
import { TicketCronService } from './ticket.schedule.service';
import { TripCronService } from './trip.schedule.service';
import { VehicleCronService } from './vehicles.schedule.service';

@Module({
  imports: [MongooseModule.forFeature(schemaProviders), ScheduleModule],
  providers: [
    VehicleCronService,
    AuthCronService,
    TicketCronService,
    ResetCronService,
    TripCronService,
  ], //Services
})
export class CronModule {}
