import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';

export type VehicleTypeDocument = VehicleType & Document;

@Schema({ versionKey: false })
export class VehicleType extends BaseEntity {
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  cost: number;
  @Prop({ required: true, default: true })
  status: boolean;
}

export const VehicleTypeSchema = SchemaFactory.createForClass(VehicleType);

VehicleTypeSchema.pre(
  ['updateOne', 'save', 'deleteOne'],
  async function (next) {
    await this.set({ updated_at: getCurrentTimestamp() });
    next();
  },
);
