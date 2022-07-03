import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema({ versionKey: false, _id: false })
export class Settings {
  @Prop({ required: true, default: false })
  dark_mode: boolean;

  @Prop({ required: true, default: 'PT' })
  language: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
