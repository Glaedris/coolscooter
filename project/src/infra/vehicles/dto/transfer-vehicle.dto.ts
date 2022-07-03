import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class TransferVehicleDto {
  @ApiProperty()
  @IsMongoId()
  current_location_area: Types.ObjectId;
  @ApiProperty()
  @IsString()
  @IsOptional()
  obs?: string;
}
