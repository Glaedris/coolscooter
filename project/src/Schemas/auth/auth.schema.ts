import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Role } from 'src/config/jwtSettings';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';

export type AuthDocument = Auth & Document;

export enum Type {
  'USER',
  'EMPLOYEE',
}

@Schema({ versionKey: false })
export class Auth extends BaseEntity {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ required: true, default: Role[Role.CLIENT] })
  role: string;

  @Prop({ required: true, default: Type[Type.USER] })
  type: string;

  @Prop({ required: true })
  identity_id: Types.ObjectId;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

AuthSchema.pre(['save'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
