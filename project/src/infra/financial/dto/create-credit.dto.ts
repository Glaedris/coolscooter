import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCreditDto {
  @IsString()
  @IsNotEmpty()
  method_id: string;
  @IsNumber()
  @Min(0)
  value: number;
}
