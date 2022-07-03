import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Location, LocationDocument } from 'src/Schemas/trip/location.schema';
import { Trip, TripDocument, TripStatus } from 'src/Schemas/trip/trip.schema';
import { Vehicle } from 'src/Schemas/vehicles/vehicle.schema';
import { getCurrentTimestamp } from 'src/utils/time';

@Injectable()
export class TripCronService {
  constructor(
    @InjectModel(Location.name)
    private locationModel: Model<LocationDocument>,
    @InjectModel(Trip.name)
    private tripModel: Model<TripDocument>,
  ) {}

  //UPDATE VEHICLE STATUS
  @Cron(CronExpression.EVERY_10_SECONDS)
  async updateLocation() {
    const getTrips = await this.tripModel
      .find({ status: TripStatus[TripStatus.STARTED] }, { _id: 1, vehicle: 1 })
      .populate('vehicle', '_id location')
      .exec();

    getTrips.forEach(async (trip) => {
      const vehicle: any = trip.vehicle;

      await new this.locationModel({
        trip_id: trip._id,
        position: vehicle.location,
      }).save();
    });
  }
}
