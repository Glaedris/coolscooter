import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LocationAreaDto {
  @ApiProperty()
  @MinLength(2)
  @IsString()
  description: string;
}
