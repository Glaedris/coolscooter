import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';
import { Auth } from './auth.schema';

export type AccessLogDocument = AccessLog & Document;

@Schema({ versionKey: false })
export class AccessLog extends BaseEntity {
  @Prop({ required: true, default: true })
  status: boolean;

  @Prop({
    required: true,
    Type: Types.ObjectId,
    ref: Auth.name,
  })
  auth_id: Types.ObjectId;
}

export const AccessLogSchema = SchemaFactory.createForClass(AccessLog);

AccessLogSchema.pre(['save'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
