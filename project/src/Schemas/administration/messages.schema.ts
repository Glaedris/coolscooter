import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';
import { Employee } from '../employee/employee.schema';

export type MessageDocument = Message & Document;

@Schema({ versionKey: false })
export class Message extends BaseEntity {
  constructor() {
    super();
    this['_id'] = new Types.ObjectId();
    this.content = '';
    this.author = null;
    this.created_at = Math.floor(Date.now() / 1000);
    this.updated_at = Math.floor(Date.now() / 1000);
  }

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Employee.name })
  author: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
