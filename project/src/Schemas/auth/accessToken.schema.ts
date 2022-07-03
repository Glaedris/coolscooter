import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../base.schema';
import { AccessLog } from './accessLog.schema';

export type AccessTokenDocument = AccessToken & Document;

@Schema({ versionKey: false })
export class AccessToken extends BaseEntity {
  @Prop({ require: true, Type: Types.ObjectId, ref: AccessLog.name })
  access_log_id: Types.ObjectId;

  @Prop()
  access_token: string;

  @Prop()
  access_token_expirate: number;

  @Prop()
  refresh_token: string;

  @Prop()
  refresh_token_expirate: number;

  @Prop()
  ip_address?: string;

  @Prop()
  deviceDetails?: string;

  @Prop({ required: true, default: true })
  status: boolean;

  @Prop({ required: true, default: false })
  abuse: boolean;

  @Prop({ type: Map })
  geolocation?: Map<string, string>;
}

export const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);
