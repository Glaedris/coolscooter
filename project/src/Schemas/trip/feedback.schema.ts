import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';
import { Trip } from './trip.schema';

export type FeedbackDocument = Feedback & Document;

@Schema({ versionKey: false })
export class Feedback extends BaseEntity {
  @Prop({ required: true, type: Types.ObjectId, ref: Trip.name })
  trip_id: Types.ObjectId;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true, min: 1, max: 5 })
  stars: number;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);

FeedbackSchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
