import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { schemaProviders } from './schemas.providers';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { LocationAreaController } from './locationArea.controller';
import { LocationAreaService } from './locationArea.service';
import { VehicleTypeController } from './vehicleType.controller';
import { VehicleTypeService } from './vehicleType.service';

@Module({
  imports: [MongooseModule.forFeature(schemaProviders)],
  controllers: [
    VehiclesController,
    MaintenanceController,
    VehicleTypeController,
    LocationAreaController,
  ],
  providers: [
    VehiclesService,
    MaintenanceService,
    VehicleTypeService,
    LocationAreaService,
  ],
})
export class VehiclesModule {}
