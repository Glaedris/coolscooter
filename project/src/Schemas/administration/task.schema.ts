import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';
import { Vehicle } from '../vehicles/vehicle.schema';
import { Message } from './messages.schema';

export type TaskDocument = Task & Document;

export enum StatusTask {
  'OPEN',
  'WORKING',
  'CLOSED',
  'CANCELLED',
}

@Schema({ versionKey: false })
export class Task extends BaseEntity {
  @Prop({ required: true })
  description: string;

  @Prop({ required: false, type: Types.ObjectId, ref: Vehicle.name })
  vehicle: Types.ObjectId;

  @Prop({
    required: true,
    Type: String,
    default: StatusTask[StatusTask.OPEN],
  })
  status: string;

  @Prop({ required: false })
  messages?: [Message];
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
