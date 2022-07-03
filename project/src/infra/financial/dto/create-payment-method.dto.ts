import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Validate } from 'class-validator';

export class CreatePaymentMethodCardDto {
  @ApiProperty()
  @IsString()
  card_name: string;
  @ApiProperty()
  @IsNumber()
  card_number: number;
  @ApiProperty()
  @IsNumber()
  card_expiration_date: number;
  @ApiProperty()
  @IsNumber()
  @Validate((value: number) => {
    console.log(value);
    return value.toString().length == 3;
  })
  card_cvc: number;
}

export class CreatePaymentMethodMbWayDto {
  @ApiProperty()
  @IsString()
  mbway_number: string;
}
