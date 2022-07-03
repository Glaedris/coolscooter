import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getCurrentTimestamp } from 'src/utils/time';
import { BaseEntity } from '../base.schema';
import { Employee } from '../employee/employee.schema';
import { Vehicle } from './vehicle.schema';

export type MaintenanceDocument = Maintenance & Document;

export enum StatusMaintenance {
  'OPEN',
  'WORKING',
  'CLOSED',
  'CANCELLED',
}

@Schema({ versionKey: false })
export class Maintenance extends BaseEntity {
  @Prop({ required: true, type: Types.ObjectId, ref: Vehicle.name })
  vehicle_id: Types.ObjectId;
  @Prop({ required: true, type: Types.ObjectId, ref: Employee.name })
  technician_id: Types.ObjectId;
  @Prop({
    required: true,
    Type: String,
    default: StatusMaintenance[StatusMaintenance.OPEN],
  })
  status: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: false })
  obs?: string;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);

MaintenanceSchema.pre(
  ['updateOne', 'save', 'deleteOne'],
  async function (next) {
    await this.set({ updated_at: getCurrentTimestamp() });
    next();
  },
);
