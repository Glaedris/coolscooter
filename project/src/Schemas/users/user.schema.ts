import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';
import { Wallet } from '../financial/wallet.schema';
import { Settings, SettingsSchema } from './settings.schema';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User extends BaseEntity {
  @Factory((faker) => faker.name.firstName())
  @Prop()
  firstName: string;

  @Factory((faker) => faker.name.lastName())
  @Prop()
  lastName: string;

  @Factory((faker) => faker.internet.email())
  @Prop()
  email: string;

  @Factory((faker) => Math.floor(Date.now() / 1000) - (86400 - 20))
  @Prop()
  birthday?: number;

  @Prop({ required: true, default: true })
  status?: boolean;

  @Prop({ required: true, type: SettingsSchema, default: new Settings() })
  settings: Settings;

  @Prop({ required: true, type: Types.ObjectId, ref: Wallet.name })
  wallet: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
