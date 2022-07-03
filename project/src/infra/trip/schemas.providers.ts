import { Feedback, FeedbackSchema } from 'src/Schemas/trip/feedback.schema';
import { Location, LocationSchema } from 'src/Schemas/trip/location.schema';
import { Trip, TripSchema } from 'src/Schemas/trip/trip.schema';
import { Vehicle, VehicleSchema } from 'src/Schemas/vehicles/vehicle.schema';

export const schemaProviders = [
  { name: Trip.name, schema: TripSchema },
  { name: Feedback.name, schema: FeedbackSchema },
  { name: Location.name, schema: LocationSchema },
  { name: Vehicle.name, schema: VehicleSchema },
];
