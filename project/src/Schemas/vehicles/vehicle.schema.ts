import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';
import { GeoPoint } from '../point.schema';
import { User } from '../users/user.schema';
import { LocationArea } from './location_area.schema';
import { Transfer } from './transfers.schema';
import { VehicleType } from './vehicle_type.schema';

export type VehicleDocument = Vehicle & Document;

export enum VehicleStatus {
  'AVAILABLE',
  'RESERVED',
  'RUNNING',
  'UNAVAILABLE',
  'MAINTENANCE',
  'DISABLED',
}

@Schema({ versionKey: false })
export class Vehicle extends BaseEntity {
  @Prop({ required: true })
  model: string;
  @Prop({ required: true })
  serial_number: string;
  @Prop({ required: true, default: true })
  active: boolean;
  @Prop({ required: true, default: 0 })
  total_km: number;
  @Prop({ required: true, default: VehicleStatus[VehicleStatus.AVAILABLE] })
  status: string;
  @Prop({ required: false, type: Types.ObjectId, ref: User.name })
  reserve_by: Types.ObjectId;
  @Prop({ required: false })
  reserve_expire: number;
  @Prop({ required: true, Type: Types.ObjectId, ref: VehicleType.name })
  vechicle_type: Types.ObjectId;
  @Prop({ type: GeoPoint, required: false, index: '2dsphere' })
  location?: GeoPoint;
  @Prop({ required: true, default: 100 })
  battery: number;
  @Prop({ required: true })
  max_velocity: number;
  @Prop({ required: false, Type: Types.ObjectId, ref: LocationArea.name })
  location_area?: Types.ObjectId;
  @Prop({ required: false })
  transfers?: [Transfer];
  @Prop({ required: true })
  created_by: Types.ObjectId;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
