import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { Transfer } from 'src/Schemas/vehicles/transfers.schema';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  model: string;
  @ApiProperty()
  @IsString()
  serial_number: string;
  @ApiProperty()
  @IsMongoId()
  vechicle_type: Types.ObjectId;
  @ApiProperty()
  @IsNumber()
  max_velocity: number;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  battery: number;
  @ApiProperty()
  @IsOptional()
  transfers: [Transfer];
}
