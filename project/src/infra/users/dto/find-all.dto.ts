import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional } from 'class-validator';

export class FindAllDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  page?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  sort?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  firstName?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  lastName?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
