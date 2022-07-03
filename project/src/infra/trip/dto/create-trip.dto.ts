import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTripDto {
  @ApiProperty()
  @IsString()
  vehicle_id: string;
}
