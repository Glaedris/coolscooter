import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../../base.schema';

export type MbWayDocument = MbWay & Document;

@Schema({ versionKey: false })
export class MbWay extends BaseEntity {
  constructor() {
    super();
    this['_id'] = new Types.ObjectId();
    this.type = 'MBWAY';
    this.created_at = getCurrentTimestamp();
    this.updated_at = getCurrentTimestamp();
  }
  @Prop({
    required: true,
    type: String,
    default: 'MBWAY',
  })
  type: string;
  @Prop({ required: true, type: String })
  mbway_number: string;
}

export const MbWaySchema = SchemaFactory.createForClass(MbWay);

MbWaySchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
