import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  @MinLength(2)
  lastName: string;
  @ApiProperty()
  @MinLength(4)
  password: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsDate()
  @IsOptional()
  birthday?: Date;
}
