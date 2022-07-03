import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';
import { GeoPoint } from '../point.schema';
import { User } from '../users/user.schema';
import { Vehicle } from '../vehicles/vehicle.schema';
import { Feedback } from './feedback.schema';

export enum TripStatus {
  'STARTED',
  'ENDED',
  'CLOSED', //WITH PAYMENT
}

export type TripDocument = Trip & Document;

@Schema({ versionKey: false })
export class Trip extends BaseEntity {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;
  @Prop({ required: true, type: Types.ObjectId, ref: Vehicle.name })
  vehicle: Types.ObjectId;
  @Prop({ required: true })
  start_time: number;
  @Prop({ required: false })
  end_time?: number;
  @Prop({ required: false })
  duration_time?: number;
  @Prop({ required: true, min: 0, max: 100 })
  start_battery: number;
  @Prop({ required: false, min: 0, max: 100 })
  end_battery?: number;
  @Prop({ required: true })
  start_position: GeoPoint;
  @Prop({ required: false })
  end_position?: GeoPoint;
  @Prop({ required: false, types: Number })
  total_cost?: number;
  @Prop({ required: true, default: 0 })
  total_km?: number;
  @Prop({ required: true, default: TripStatus[TripStatus.STARTED] })
  status?: string;
}

export const TripSchema = SchemaFactory.createForClass(Trip);

TripSchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
