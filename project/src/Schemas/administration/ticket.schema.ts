import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';
import { Vehicle } from '../vehicles/vehicle.schema';

export type TicketDocument = Ticket & Document;

export enum StatusTicket {
  'OPEN',
  'TO_SEND',
  'CLOSED',
  'CANCELLED',
}

@Schema({ versionKey: false })
export class Ticket extends BaseEntity {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: false })
  response?: string;

  @Prop({ required: false })
  response_date?: number;

  @Prop({ required: false, type: Types.ObjectId, ref: Vehicle.name })
  vehicle?: Types.ObjectId;

  @Prop({
    required: true,
    Type: String,
    default: StatusTicket[StatusTicket.OPEN],
    index: true,
  })
  status: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
