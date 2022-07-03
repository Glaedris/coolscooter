import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getCurrentTimestamp } from 'src/utils/time';

@Schema()
export class BaseEntity {
  @Prop({ default: () => getCurrentTimestamp() })
  created_at?: number;

  @Prop({ default: () => getCurrentTimestamp() })
  updated_at?: number;
}
