import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { schemaProviders } from './schemas.providers';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesService } from '../vehicles/vehicles.service';

@Module({
  imports: [MongooseModule.forFeature(schemaProviders)],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
