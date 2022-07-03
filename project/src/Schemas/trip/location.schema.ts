import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../base.schema';
import { GeoPoint } from '../point.schema';
import { Trip } from './trip.schema';

export type LocationDocument = Location & Document;

@Schema({ versionKey: false })
export class Location extends BaseEntity {
  @Prop({ required: true, type: Types.ObjectId, ref: Trip.name, index: true })
  trip_id: Types.ObjectId;
  @Prop({ required: true })
  position: GeoPoint;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
