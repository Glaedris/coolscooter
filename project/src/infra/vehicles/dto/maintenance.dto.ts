import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { StatusMaintenance } from 'src/Schemas/vehicles/maintenance.schema';

export class MaintenanceDto {
  @ApiProperty()
  @IsMongoId()
  vehicle_id: Types.ObjectId;
  @ApiProperty()
  @IsMongoId()
  technician_id: Types.ObjectId;
  @ApiProperty()
  @IsString()
  @IsOptional()
  status: StatusMaintenance;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  obs?: string;
}
