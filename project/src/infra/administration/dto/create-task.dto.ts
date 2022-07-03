import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTaskDto {
  @IsString()
  @ApiProperty()
  description: string;
  @IsOptional()
  @IsMongoId()
  @ApiProperty()
  vehicle?: Types.ObjectId;
}
