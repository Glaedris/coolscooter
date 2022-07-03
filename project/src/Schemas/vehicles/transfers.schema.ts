import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { BaseEntity } from '../base.schema';

export type TransferDocument = Transfer & Document;

@Schema({ versionKey: false, _id: false })
export class Transfer extends BaseEntity {
  constructor() {
    super();
    this.active = true;
    this.created_at = Math.floor(Date.now() / 1000);
    this.updated_at = Math.floor(Date.now() / 1000);
  }
  @Prop({ required: true })
  current_location_area: Types.ObjectId;
  @Prop({ required: true })
  previous_location_area?: Types.ObjectId;
  @Prop({ required: false })
  obs?: string;
  @Prop({ required: true, default: true })
  active?: boolean;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
