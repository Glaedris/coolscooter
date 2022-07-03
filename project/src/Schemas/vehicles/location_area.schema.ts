import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';

export type LocationAreaDocument = LocationArea & Document;

@Schema({ versionKey: false })
export class LocationArea extends BaseEntity {
  @Prop({ required: true })
  description: string;
  @Prop({ required: true, default: true })
  status: boolean;
}

export const LocationAreaSchema = SchemaFactory.createForClass(LocationArea);

LocationAreaSchema.pre(
  ['updateOne', 'save', 'deleteOne'],
  async function (next) {
    await this.set({ updated_at: getCurrentTimestamp() });
    next();
  },
);
