import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model, Types } from 'mongoose';
import { GeoPoint } from 'src/Schemas/point.schema';
import {
  Vehicle,
  VehicleDocument,
  VehicleStatus,
} from 'src/Schemas/vehicles/vehicle.schema';
import { generateLocation } from 'src/utils/randomCoordinates';
import { getCurrentTimestamp } from 'src/utils/time';

@Injectable()
export class VehicleCronService {
  constructor(
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<VehicleDocument>,
  ) {}

  //UPDATE VEHICLE STATUS
  @Cron(CronExpression.EVERY_MINUTE)
  async updateVehicleStatus() {
    const currentTime = getCurrentTimestamp();
    await this.vehicleModel
      .updateMany(
        {
          status: VehicleStatus[VehicleStatus.RESERVED],
          reserve_expire: { $lt: currentTime },
        },
        {
          $unset: {
            reserve_by: 1,
            reserve_expire: 1,
          },
          status: VehicleStatus[VehicleStatus.AVAILABLE],
        },
      )
      .exec();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async randomCoordinates() {
    const vehicles = await this.vehicleModel.find({});
    const ipcaCoordinates = {
      latitude: 41.536885,
      longitude: -8.627984,
    };
    vehicles.forEach((vehicle) => {
      const auxLocation = generateLocation(
        ipcaCoordinates.latitude,
        ipcaCoordinates.longitude,
        0.2,
      );
      vehicle.location = new GeoPoint(
        auxLocation.newLongitude,
        auxLocation.newLatitude,
      );
      vehicle.save();
    });
  }
}
