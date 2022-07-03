import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document, Types } from 'mongoose';
import {
  getCurrentTimestamp,
  getResetPasswordExpiration,
} from 'src/utils/time';
import { BaseEntity } from '../base.schema';
import { Auth, AuthSchema } from './auth.schema';

export type ResetPasswordDocument = ResetPassword & Document;

@Schema({ versionKey: false })
export class ResetPassword extends BaseEntity {
  @Prop({ required: true })
  auth_id: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({
    required: true,
    default: getResetPasswordExpiration(),
  })
  expiration: number;

  @Prop({ required: true, default: false })
  expired: boolean;

  @Prop({ required: true, default: false })
  used: boolean;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);

ResetPasswordSchema.pre(
  ['updateOne', 'save', 'deleteOne'],
  async function (next) {
    await this.set({ updated_at: getCurrentTimestamp() });
    next();
  },
);
