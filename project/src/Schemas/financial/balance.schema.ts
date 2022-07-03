import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';

export type BalanceDocument = Balance & Document;

export enum TypeBalance {
  'CREDIT',
  'DEBIT',
}

@Schema({ versionKey: false, _id: false })
export class Balance extends BaseEntity {
  constructor() {
    super();
    this['_id'] = new Types.ObjectId();
    this.type = TypeBalance[TypeBalance.CREDIT];
    this.created_at = getCurrentTimestamp();
    this.updated_at = getCurrentTimestamp();
  }
  @Prop({ required: true, uppercase: true })
  type: string;
  @Prop({ required: true, type: Types.ObjectId })
  method_type: string;
  @Prop({ required: true, type: Number })
  value: number;
}

export const BalanceSchema = SchemaFactory.createForClass(Balance);

BalanceSchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
