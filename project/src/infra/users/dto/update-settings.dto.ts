import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  dark_mode?: boolean;
  @ApiProperty()
  @IsString()
  @MaxLength(2)
  @MinLength(2)
  @IsOptional()
  language?: string;
}
