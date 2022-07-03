import {
  AccessToken,
  AccessTokenSchema,
} from 'src/Schemas/auth/accessToken.schema';
import {
  ResetPassword,
  ResetPasswordSchema,
} from 'src/Schemas/auth/resetPassword.schema';
import { Location, LocationSchema } from 'src/Schemas/trip/location.schema';
import { Trip, TripSchema } from 'src/Schemas/trip/trip.schema';
import { Vehicle, VehicleSchema } from 'src/Schemas/vehicles/vehicle.schema';

export const schemaProviders = [
  { name: Vehicle.name, schema: VehicleSchema },
  { name: AccessToken.name, schema: AccessTokenSchema },
  { name: ResetPassword.name, schema: ResetPasswordSchema },
  { name: Trip.name, schema: TripSchema },
  { name: Location.name, schema: LocationSchema },
];
