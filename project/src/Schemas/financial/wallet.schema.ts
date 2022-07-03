import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';
import { User } from '../users/user.schema';
import { Balance } from './balance.schema';
import { CreditCard } from './PaymentMethods/card.schema';
import { MbWay } from './PaymentMethods/mbway.schema';

export type WalletDocument = Wallet & Document;
export type PaymentType = MbWay | CreditCard;

@Schema({ versionKey: false })
export class Wallet extends BaseEntity {
  @Prop({ required: true, type: Number, default: 0 })
  current_balance: number;
  @Prop({ required: false })
  balance?: [Balance];
  @Prop({ required: false })
  payment_methods?: Array<PaymentType>;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
