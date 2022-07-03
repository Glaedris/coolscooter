import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { StatusMaintenance } from 'src/Schemas/vehicles/maintenance.schema';

export class MaintenanceUpdateDto {
  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  technician_id: Types.ObjectId;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  obs?: string;
}
