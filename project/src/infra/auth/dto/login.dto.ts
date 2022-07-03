import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Min, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty()
  username: string;
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty()
  password: string;
}
