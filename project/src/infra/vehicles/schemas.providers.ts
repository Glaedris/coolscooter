import {
  LocationArea,
  LocationAreaSchema,
} from 'src/Schemas/vehicles/location_area.schema';
import {
  Maintenance,
  MaintenanceSchema,
} from 'src/Schemas/vehicles/maintenance.schema';
import {
  Transfer,
  TransferSchema,
} from 'src/Schemas/vehicles/transfers.schema';
import { Vehicle, VehicleSchema } from 'src/Schemas/vehicles/vehicle.schema';
import {
  VehicleType,
  VehicleTypeSchema,
} from 'src/Schemas/vehicles/vehicle_type.schema';

export const schemaProviders = [
  { name: Vehicle.name, schema: VehicleSchema },
  { name: Maintenance.name, schema: MaintenanceSchema },
  { name: LocationArea.name, schema: LocationAreaSchema },
  { name: VehicleType.name, schema: VehicleTypeSchema },
];
