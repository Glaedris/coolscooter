import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class VehicleTypeDto {
  @ApiProperty()
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cost: number;
}
