import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../../base.schema';

export type CreditCardDocument = CreditCard & Document;

@Schema({ versionKey: false })
export class CreditCard extends BaseEntity {
  constructor() {
    super();
    this['_id'] = new Types.ObjectId();
    this.type = 'CREDIT_CARD';
    this.created_at = getCurrentTimestamp();
    this.updated_at = getCurrentTimestamp();
  }
  @Prop({
    required: true,
    type: String,
    default: 'CREDIT_CARD',
  })
  type: string;
  @Prop({ required: true, type: String })
  card_name: string;
  @Prop({ required: true, type: Number })
  card_number: number;
  @Prop({ required: true, type: Number })
  card_expiration_date: number;
  @Prop({ required: true, type: Number, length: 3 })
  card_cvc: number;
}

export const CreditCardSchema = SchemaFactory.createForClass(CreditCard);

CreditCardSchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
