import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTicketDto {
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsString()
  @ApiProperty()
  subject: string;
  @IsString()
  @ApiProperty()
  message: string;
  @IsOptional()
  @IsMongoId()
  @ApiProperty()
  vehicle?: Types.ObjectId;
}
