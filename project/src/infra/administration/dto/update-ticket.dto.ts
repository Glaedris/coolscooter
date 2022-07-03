import { IsString } from 'class-validator';

export class ResponseTicketDto {
  @IsString()
  response: string;
}
