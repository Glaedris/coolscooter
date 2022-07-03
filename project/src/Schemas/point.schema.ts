import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type GeoPointDocument = GeoPoint & Document;

@Schema({ versionKey: false, _id: false })
export class GeoPoint {
  constructor(longitude: number, latitude: number) {
    const coordinates = [longitude, latitude];
    this.coordinates = coordinates;
  }
  @Prop({ required: true, default: 'Point' })
  type?: string;
  @Prop({ required: true })
  coordinates: number[];
}

export const GeoPointSchema = SchemaFactory.createForClass(GeoPoint);
