import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  description: string;
}
