import { ApiProperty } from '@nestjs/swagger';
import { Length, MinLength } from 'class-validator';

export class ResetPasswordConfirmationDto {
  @Length(8)
  @ApiProperty()
  code: string;
  @MinLength(4)
  @ApiProperty()
  password: string;
}
