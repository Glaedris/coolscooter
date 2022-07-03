import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class VehicleTypeUpdateDto {
  @ApiProperty()
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  cost?: number;
}
