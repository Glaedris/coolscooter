import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { Transfer } from 'src/Schemas/vehicles/transfers.schema';

export class UpdateVehicleDto {
  @ApiProperty()
  @IsString()
  model: string;
  @ApiProperty()
  @IsMongoId()
  vechicle_type: Types.ObjectId;
  @ApiProperty()
  @IsNumber()
  max_velocity: number;
}
