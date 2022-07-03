import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';

export type EmployeeDocument = Employee & Document;

@Schema({ versionKey: false })
export class Employee extends BaseEntity {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  birthday?: number;

  @Prop({ required: true, default: true })
  status: boolean;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.pre(['updateOne', 'save', 'deleteOne'], async function (next) {
  await this.set({ updated_at: getCurrentTimestamp() });
  next();
});
